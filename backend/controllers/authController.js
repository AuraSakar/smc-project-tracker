const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
};

exports.login = async (req, res, next) => {
  try {
    const { employeeId, password } = req.body;
    const user = await User.findOne({ employeeId, isActive: true });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    res.json({
      success: true,
      token: generateToken(user._id),
      user: { id: user._id, name: user.name, employeeId: user.employeeId, role: user.role, department: user.department },
    });
  } catch (error) {
    next(error);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

exports.register = async (req, res, next) => {
  try {
    const { name, employeeId, email, password, role, department } = req.body;
    const existingUser = await User.findOne({ $or: [{ employeeId }, { email }] });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Employee ID or Email already exists' });
    }
    const user = await User.create({ name, employeeId, email, password, role: role || 'viewer', department });
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: { id: user._id, name: user.name, employeeId: user.employeeId, role: user.role },
    });
  } catch (error) {
    next(error);
  }
};