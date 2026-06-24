const express = require('express');
const router = express.Router();
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  addUpdate,
} = require('../controllers/projectController');
const { protect, requireAdmin, requireSuperAdmin } = require('../middleware/authMiddleware');

router.get('/', getProjects);
router.get('/:id', getProject);
router.post('/', protect, requireAdmin, createProject);
router.put('/:id', protect, requireAdmin, updateProject);
router.delete('/:id', protect, requireSuperAdmin, deleteProject);
router.post('/:id/updates', protect, requireAdmin, addUpdate);

module.exports = router;