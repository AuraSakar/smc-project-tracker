const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
};

exports.login = async (req, res, next) => {
  try {
    const { employeeId, password } = req.body;
    const user = await prisma.user.findUnique({
      where: { employeeId },
    });

    if (!user || !user.isActive) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    res.json({
      success: true,
      token: generateToken(user.id),
      user: { id: user.id, name: user.name, employeeId: user.employeeId, role: user.role, department: user.department },
    });
  } catch (error) {
    next(error);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        employeeId: true,
        email: true,
        role: true,
        department: true,
        isActive: true,
        createdAt: true,
      },
    });
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

exports.register = async (req, res, next) => {
  try {
    const { name, employeeId, email, password, role, department } = req.body;
    
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { employeeId },
          { email }
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Employee ID or Email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        name,
        employeeId,
        email,
        password: hashedPassword,
        role: role || 'viewer',
        department,
      },
    });

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: { id: user.id, name: user.name, employeeId: user.employeeId, role: user.role },
    });
  } catch (error) {
    next(error);
  }
};