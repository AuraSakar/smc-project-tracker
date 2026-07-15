const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// @desc    Get all contractor masters
// @route   GET /api/contractors
// @access  Public (or Admin)
exports.getContractors = async (req, res, next) => {
  try {
    const contractors = await prisma.contractorMaster.findMany({
      orderBy: { firmName: 'asc' }
    });
    res.status(200).json({ success: true, contractors });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new contractor master
// @route   POST /api/contractors
// @access  Admin
exports.createContractor = async (req, res, next) => {
  try {
    const { firmName, contactPerson, contactNumber } = req.body;
    
    if (!firmName) {
      return res.status(400).json({ success: false, message: 'Firm Name is required' });
    }

    const contractor = await prisma.contractorMaster.create({
      data: { firmName, contactPerson, contactNumber }
    });

    res.status(201).json({ success: true, contractor });
  } catch (error) {
    next(error);
  }
};
