const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getProjects = async (req, res, next) => {
  try {
    const { category, status, ward, search, page = 1, limit = 10 } = req.query;
    
    let where = { isPublic: true };
    if (category) where.category = category;
    if (status) where.status = status;
    if (ward) where.ward = ward;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const [total, projects] = await Promise.all([
      prisma.project.count({ where }),
      prisma.project.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          officials: true,
          documents: true,
          updates: true,
        },
      }),
    ]);

    // Map the id to _id for frontend compatibility if needed, though frontend should use _id
    const formattedProjects = projects.map(p => ({
      ...p,
      _id: p.id
    }));

    res.json({
      success: true,
      count: projects.length,
      total,
      totalPages: Math.ceil(total / take),
      currentPage: parseInt(page),
      projects: formattedProjects,
    });
  } catch (error) {
    next(error);
  }
};

exports.getProject = async (req, res, next) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: req.params.id },
      include: {
        officials: true,
        documents: true,
        updates: { orderBy: { date: 'desc' } },
      },
    });
    
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    
    res.json({ success: true, project: { ...project, _id: project.id } });
  } catch (error) {
    next(error);
  }
};

exports.createProject = async (req, res, next) => {
  try {
    const year = new Date().getFullYear();
    const count = await prisma.project.count();
    const projectId = `SMC-${year}-${String(count + 1).padStart(3, '0')}`;

    const projectData = { ...req.body, projectId };

    // Remove relations from flat body if they exist
    const officials = projectData.officials || [];
    const updates = projectData.updates || [];
    const documents = projectData.documents || [];
    
    delete projectData.officials;
    delete projectData.updates;
    delete projectData.documents;

    // Convert dates
    if (projectData.startDate) projectData.startDate = new Date(projectData.startDate);
    if (projectData.expectedCompletionDate) projectData.expectedCompletionDate = new Date(projectData.expectedCompletionDate);
    if (projectData.actualCompletionDate) projectData.actualCompletionDate = new Date(projectData.actualCompletionDate);

    const project = await prisma.project.create({
      data: {
        ...projectData,
        officials: { create: officials },
        documents: { create: documents },
        updates: { create: updates },
      },
      include: { officials: true, documents: true, updates: true },
    });

    res.status(201).json({ success: true, project: { ...project, _id: project.id } });
  } catch (error) {
    next(error);
  }
};

exports.updateProject = async (req, res, next) => {
  try {
    const projectData = { ...req.body };
    delete projectData.id;
    delete projectData._id;
    delete projectData.projectId;
    
    // In this basic version, we just update scalar fields. 
    // Updating nested officials/documents requires specific logic. We'll ignore them for now.
    delete projectData.officials;
    delete projectData.documents;
    delete projectData.updates;

    // Convert dates
    if (projectData.startDate) projectData.startDate = new Date(projectData.startDate);
    if (projectData.expectedCompletionDate) projectData.expectedCompletionDate = new Date(projectData.expectedCompletionDate);
    if (projectData.actualCompletionDate) projectData.actualCompletionDate = new Date(projectData.actualCompletionDate);

    const project = await prisma.project.update({
      where: { id: req.params.id },
      data: projectData,
      include: { officials: true, documents: true, updates: true },
    });

    res.json({ success: true, project: { ...project, _id: project.id } });
  } catch (error) {
    if (error.code === 'P2025') { // Record not found
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    next(error);
  }
};

exports.deleteProject = async (req, res, next) => {
  try {
    await prisma.project.delete({
      where: { id: req.params.id },
    });
    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    next(error);
  }
};

exports.addUpdate = async (req, res, next) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: req.params.id },
    });

    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    const updatedProject = await prisma.project.update({
      where: { id: req.params.id },
      data: {
        updates: {
          create: {
            note: req.body.note,
            updatedBy: req.body.updatedBy || req.user.name,
          }
        }
      },
      include: { officials: true, documents: true, updates: { orderBy: { date: 'desc' } } },
    });

    res.json({ success: true, project: { ...updatedProject, _id: updatedProject.id } });
  } catch (error) {
    next(error);
  }
};