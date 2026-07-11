require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const seed = async () => {
  try {
    console.log('Connecting to PostgreSQL for seeding...');

    // Clear existing data
    await prisma.projectOfficial.deleteMany();
    await prisma.projectDocument.deleteMany();
    await prisma.projectUpdate.deleteMany();
    await prisma.project.deleteMany();
    await prisma.user.deleteMany();

    const hashedPassword = await bcrypt.hash('Admin@123', 10);

    await prisma.user.create({
      data: {
        name: 'Super Admin',
        employeeId: 'SMC001',
        email: 'admin@solapurcorporation.gov.in',
        password: hashedPassword,
        role: 'superadmin',
        department: 'Administration',
      }
    });

    const projects = [
      {
        title: 'Hotgi Road Widening and Beautification',
        category: 'Road',
        ward: 'Ward No. 5',
        fromLocation: 'Hotgi Naka',
        toLocation: 'Railway Station Chowk',
        status: 'In Progress',
        completionPercent: 65,
        estimatedCost: 4500000,
        amountSpent: 2900000,
        startDate: new Date('2024-01-15'),
        expectedCompletionDate: new Date('2024-12-31'),
        description: 'Four-lane road widening with footpaths, drainage, and street lighting along Hotgi Road.',
        googleMapsLink: 'https://maps.google.com/?q=Hotgi+Road+Solapur',
        latitude: 17.6805, longitude: 75.9064,
        officials: [{ name: 'Rajesh Patil', designation: 'City Engineer', department: 'Public Works', contactNumber: '0217-2740335' }],
      },
      {
        title: 'Siddheshwar Lake Restoration Project',
        category: 'Water Supply',
        ward: 'City-wide',
        fromLocation: 'Siddheshwar Lake, Solapur',
        status: 'Planned',
        completionPercent: 0,
        estimatedCost: 25000000,
        amountSpent: 0,
        startDate: new Date('2024-06-01'),
        expectedCompletionDate: new Date('2026-05-31'),
        description: 'Restoration and desilting of Siddheshwar Lake to increase water storage capacity and improve water supply.',
        latitude: 17.6845, longitude: 75.9102,
        officials: [{ name: 'Suresh Deshmukh', designation: 'Water Supply Engineer', department: 'Water Works', contactNumber: '0217-2735293' }],
      },
      {
        title: 'Hutatma Chowk Garden Development',
        category: 'Park/Garden',
        ward: 'Ward No. 14',
        fromLocation: 'Hutatma Chowk, Solapur',
        status: 'Completed',
        completionPercent: 100,
        estimatedCost: 1200000,
        amountSpent: 1180000,
        startDate: new Date('2023-10-01'),
        expectedCompletionDate: new Date('2024-03-31'),
        actualCompletionDate: new Date('2024-03-20'),
        description: 'Development of a modern garden with seating, fountain, lighting, and children\'s play area.',
        latitude: 17.6749, longitude: 75.9082,
        officials: [{ name: 'Meena Kulkarni', designation: 'Garden Superintendent', department: 'Garden Department', contactNumber: '' }],
      },
      {
        title: 'Murarji Peth Drainage Improvement',
        category: 'Drainage',
        ward: 'Ward No. 8',
        fromLocation: 'Murarji Peth Junction',
        toLocation: 'Main Drain Outlet',
        status: 'Tender Issued',
        completionPercent: 0,
        estimatedCost: 3200000,
        amountSpent: 0,
        startDate: new Date('2024-09-01'),
        expectedCompletionDate: new Date('2025-06-30'),
        description: 'Underground drainage pipeline replacement to resolve water-logging issues in Murarji Peth area.',
        latitude: 17.6695, longitude: 75.9189,
        officials: [{ name: 'Anil Shinde', designation: 'Ward Officer', department: 'Engineering', contactNumber: '' }],
      },
      {
        title: 'SMC New Administrative Building — Phase 2',
        category: 'Building',
        ward: 'City-wide',
        fromLocation: 'Rajwada Chowk, Solapur',
        status: 'In Progress',
        completionPercent: 40,
        estimatedCost: 120000000,
        amountSpent: 48000000,
        startDate: new Date('2023-04-01'),
        expectedCompletionDate: new Date('2026-03-31'),
        description: 'Construction of Phase 2 of the new SMC administrative complex with modern citizen service counters.',
        latitude: 17.6730, longitude: 75.9038,
        officials: [
          { name: 'Dr. Sachin Ombase', designation: 'Municipal Commissioner', department: 'Administration', contactNumber: '0217-2735293' },
          { name: 'Vinod Salokhe', designation: 'Structural Engineer', department: 'Public Works', contactNumber: '' },
        ],
      },
    ];

    let count = 1;
    for (const proj of projects) {
      const year = new Date().getFullYear();
      const projectId = `SMC-${year}-${String(count).padStart(3, '0')}`;
      
      const { officials, ...projectData } = proj;

      await prisma.project.create({
        data: {
          ...projectData,
          projectId,
          officials: {
            create: officials,
          }
        }
      });
      count++;
    }

    console.log('Seed data inserted successfully into PostgreSQL!');
    console.log('Default superadmin: employeeId=SMC001, password=Admin@123');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

seed();