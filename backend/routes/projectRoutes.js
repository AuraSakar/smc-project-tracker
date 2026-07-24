const express = require('express');
const router = express.Router();
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  addUpdate,
  getProjectBills,
  addProjectBill,
  deleteProjectBill,
} = require('../controllers/projectController');
const { protect, requireAdmin, requireSuperAdmin, requireDepartment } = require('../middleware/authMiddleware');

router.get('/', getProjects);
router.get('/:id', getProject);
router.post('/', protect, requireAdmin, createProject);
router.put('/:id', protect, requireAdmin, updateProject);
router.delete('/:id', protect, requireSuperAdmin, deleteProject);
router.post('/:id/updates', protect, requireAdmin, addUpdate);

// Billing Endpoints
router.get('/:id/bills', getProjectBills);
router.post('/:id/bills', protect, requireDepartment, addProjectBill);
router.delete('/:id/bills/:billId', protect, requireDepartment, deleteProjectBill);

module.exports = router;