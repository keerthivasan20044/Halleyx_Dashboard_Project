import express from 'express';
import { getDashboard, saveDashboard, deleteWidget, addWidget, getAnalytics } from '../controllers/dashboard.js';

const router = express.Router();

// Get dashboard configuration
router.get('/config', getDashboard);

// Save dashboard configuration
router.post('/config', saveDashboard);

// Add single widget
router.post('/widget', addWidget);

// Delete specific widget
router.delete('/widget/:widgetId', deleteWidget);

// Get analytics data
router.get('/analytics', getAnalytics);

export default router;