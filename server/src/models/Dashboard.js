import mongoose from 'mongoose';

const widgetSchema = new mongoose.Schema({
  id: { type: String, required: true },
  type: { type: String, required: true },
  x: { type: Number, default: 0 },
  y: { type: Number, default: 0 },
  w: { type: Number, default: 4 },
  h: { type: Number, default: 3 },
  config: {
    title: String,
    description: String,
    xField: String,
    yField: String,
    color: String,
    showLabel: Boolean,
    aggregation: String,
    chartType: String
  },
  isActive: { type: Boolean, default: true }
}, { _id: false });

const dashboardSchema = new mongoose.Schema({
  userId: { type: String, default: 'default' },
  widgets: [widgetSchema],
  dateFilter: { type: String, default: 'all' },
  isConfigured: { type: Boolean, default: false },
  lastModified: { type: Date, default: Date.now }
}, { timestamps: true });

// Update lastModified on save
dashboardSchema.pre('save', function() {
  this.lastModified = new Date();
});

export default mongoose.model('Dashboard', dashboardSchema);
