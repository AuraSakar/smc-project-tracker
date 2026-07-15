const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// @desc    Get all official masters
// @route   GET /api/officials
// @access  Public (or Admin)
exports.getOfficials = async (req, res, next) => {
  try {
    const officials = await prisma.officialMaster.findMany({
      orderBy: { name: 'asc' }
    });
    res.status(200).json({ success: true, officials });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new official master
// @route   POST /api/officials
// @access  Admin
exports.createOfficial = async (req, res, next) => {
  try {
    const { name, designation, department, contactNumber } = req.body;
    
    if (!name || !designation) {
      return res.status(400).json({ success: false, message: 'Name and designation are required' });
    }

    const official = await prisma.officialMaster.create({
      data: { name, designation, department, contactNumber }
    });

    res.status(201).json({ success: true, official });
  } catch (error) {
    next(error);
  }
};
