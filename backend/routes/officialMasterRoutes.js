const express = require('express');
const { getOfficials, createOfficial } = require('../controllers/officialMasterController');
const { protect, requireAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(protect, getOfficials)
  .post(protect, requireAdmin, createOfficial);

module.exports = router;
