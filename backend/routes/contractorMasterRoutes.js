const express = require('express');
const { getContractors, createContractor } = require('../controllers/contractorMasterController');
const { protect, requireAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(protect, getContractors)
  .post(protect, requireAdmin, createContractor);

module.exports = router;
