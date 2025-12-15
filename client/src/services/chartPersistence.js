import { dashboardAPI } from './api';

const STORAGE_KEY = 'dashboard_charts_backup';

class ChartPersistenceService {
  // Save charts to both database and localStorage
  async saveCharts(widgets, dateFilter = 'all') {
    try {
      // Primary: Save to database
      const result = await dashboardAPI.saveConfig({ widgets, dateFilter });
      
      // Backup: Save to localStorage
      this.saveToLocalStorage(widgets, dateFilter);
      
      return result;
    } catch (error) {
      console.error('Database save failed, using localStorage:', error);
      // Fallback: Save only to localStorage
      this.saveToLocalStorage(widgets, dateFilter);
      return { widgets, dateFilter };
    }
  }

  // Load charts from database with localStorage fallback
  async loadCharts() {
    try {
      // Primary: Load from database
      const result = await dashboardAPI.getConfig();
      
      if (result.widgets) {
        // Backup successful database load to localStorage
        this.saveToLocalStorage(result.widgets, result.dateFilter);
        return {
          widgets: result.widgets,
          dateFilter: result.dateFilter || 'all'
        };
      }
      
      // Fallback: Load from localStorage if database is empty
      return this.loadFromLocalStorage();
    } catch (error) {
      console.error('Database load failed, using localStorage:', error);
      // Fallback: Load from localStorage
      return this.loadFromLocalStorage();
    }
  }

  // Delete specific chart
  async deleteChart(widgetId) {
    try {
      // Get current dashboard data
      const dashboardData = await this.loadCharts();
      
      // Remove the widget
      const updatedWidgets = dashboardData.widgets.filter(w => w.id !== widgetId);
      
      // Save updated list
      return await this.saveCharts(updatedWidgets, dashboardData.dateFilter);
    } catch (error) {
      console.error('Chart deletion failed:', error);
      throw error;
    }
  }

  // Add new chart
  async addChart(widget) {
    try {
      // Get current dashboard data
      const dashboardData = await this.loadCharts();
      
      // Add new widget
      const updatedWidgets = [...dashboardData.widgets, widget];
      
      // Save updated list
      return await this.saveCharts(updatedWidgets, dashboardData.dateFilter);
    } catch (error) {
      console.error('Chart addition failed:', error);
      throw error;
    }
  }

  // localStorage operations
  saveToLocalStorage(widgets, dateFilter = 'all') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        widgets,
        dateFilter,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.error('localStorage save failed:', error);
    }
  }

  loadFromLocalStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        return {
          widgets: data.widgets || [],
          dateFilter: data.dateFilter || 'all'
        };
      }
    } catch (error) {
      console.error('localStorage load failed:', error);
    }
    return { widgets: [], dateFilter: 'all' };
  }

  // Clear all charts
  async clearAllCharts() {
    try {
      await this.saveCharts([]);
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Clear charts failed:', error);
      throw error;
    }
  }

  // Check if charts exist
  async hasCharts() {
    try {
      const dashboardData = await this.loadCharts();
      return dashboardData.widgets.length > 0;
    } catch (error) {
      return false;
    }
  }
}

export const chartPersistence = new ChartPersistenceService();
export default chartPersistence;