import mongoose from 'mongoose'

const dashboardConfigSchema = new mongoose.Schema({
  userId: { type: String, default: 'default' },
  layout: [{
    i: String,
    x: Number,
    y: Number,
    w: Number,
    h: Number,
    static: { type: Boolean, default: false }
  }],
  widgets: [{
    id: String,
    type: {
      type: String,
      enum: ['KPI', 'BarChart', 'LineChart', 'AreaChart', 'ScatterChart', 'PieChart', 'Table']
    },
    config: mongoose.Schema.Types.Mixed,
    position: {
      x: Number,
      y: Number,
      w: Number,
      h: Number
    }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

export default mongoose.model('DashboardConfig', dashboardConfigSchema)
