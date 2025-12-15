import DashboardConfig from '../models/DashboardConfig.js'
import { validateDashboardConfig } from '../utils/validators.js'
import { sendSuccess, sendError, sendValidationError } from '../utils/response.js'

export const getConfig = async (req, res, next) => {
  try {
    const { userId = 'default' } = req.query

    let config = await DashboardConfig.findOne({ userId })
    
    if (!config) {
      config = new DashboardConfig({
        userId,
        layout: [],
        widgets: [],
      })
      await config.save()
    }

    sendSuccess(res, config)
  } catch (error) {
    next(error)
  }
}

export const saveConfig = async (req, res, next) => {
  try {
    const { userId = 'default', layout = [], widgets = [] } = req.body

    const { isValid, errors } = validateDashboardConfig({ layout, widgets })
    if (!isValid) {
      return sendValidationError(res, errors)
    }

    let config = await DashboardConfig.findOne({ userId })

    if (config) {
      config.layout = layout
      config.widgets = widgets
      config.updatedAt = new Date()
      await config.save()
    } else {
      config = new DashboardConfig({
        userId,
        layout,
        widgets,
      })
      await config.save()
    }

    sendSuccess(res, config)
  } catch (error) {
    next(error)
  }
}

export const deleteConfig = async (req, res, next) => {
  try {
    const { userId = 'default' } = req.query

    await DashboardConfig.deleteOne({ userId })

    sendSuccess(res, { message: 'Configuration deleted' })
  } catch (error) {
    next(error)
  }
}
