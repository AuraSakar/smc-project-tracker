const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  projectId: { type: String, unique: true },
  category: {
    type: String,
    enum: ['Road', 'Water Supply', 'Drainage', 'Park/Garden', 'Building', 'Electricity', 'Other'],
    required: true,
  },
  description: { type: String, required: true },
  ward: { type: String, required: true },
  fromLocation: { type: String, required: true },
  toLocation: { type: String },
  googleMapsLink: { type: String },
  latitude: { type: Number },
  longitude: { type: Number },
  estimatedCost: { type: Number, required: true },
  amountSpent: { type: Number, default: 0 },
  contractor: { type: String },
  status: {
    type: String,
    enum: ['Planned', 'Tender Issued', 'In Progress', 'On Hold', 'Completed', 'Cancelled'],
    default: 'Planned',
  },
  completionPercent: { type: Number, default: 0, min: 0, max: 100 },
  startDate: { type: Date, required: true },
  expectedCompletionDate: { type: Date, required: true },
  actualCompletionDate: { type: Date },
  officials: [
    {
      name: { type: String, required: true },
      designation: { type: String, required: true },
      department: { type: String },
      contactNumber: { type: String },
    },
  ],
  images: [{ type: String }],
  documents: [
    {
      name: { type: String },
      url: { type: String },
    },
  ],
  updates: [
    {
      date: { type: Date, default: Date.now },
      note: { type: String },
      updatedBy: { type: String },
    },
  ],
  isPublic: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

projectSchema.pre('save', async function (next) {
  if (!this.projectId) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('Project').countDocuments();
    this.projectId = `SMC-${year}-${String(count + 1).padStart(3, '0')}`;
  }
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Project', projectSchema);