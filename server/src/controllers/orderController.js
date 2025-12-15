import Order from '../models/Order.js'
import { validateOrder, isValidObjectId } from '../utils/validators.js'
import { sendSuccess, sendError, sendValidationError, sendNotFound } from '../utils/response.js'

export const getOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query
    const skip = (page - 1) * limit

    const query = search ? {
      $or: [
        { 'customer.firstName': { $regex: search, $options: 'i' } },
        { 'customer.lastName': { $regex: search, $options: 'i' } },
        { 'customer.email': { $regex: search, $options: 'i' } },
        { 'order.product': { $regex: search, $options: 'i' } },
      ]
    } : {}

    const orders = await Order.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 })

    const total = await Order.countDocuments(query)

    sendSuccess(res, {
      orders,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: parseInt(page),
        pageSize: parseInt(limit),
      }
    })
  } catch (error) {
    next(error)
  }
}

export const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params

    if (!isValidObjectId(id)) {
      return sendError(res, 'Invalid order ID', 400)
    }

    const order = await Order.findById(id)
    if (!order) {
      return sendNotFound(res, 'Order not found')
    }

    sendSuccess(res, order)
  } catch (error) {
    next(error)
  }
}

export const createOrder = async (req, res, next) => {
  try {
    const { isValid, errors } = validateOrder(req.body)
    if (!isValid) {
      return sendValidationError(res, errors)
    }

    const total = (req.body.order.quantity * req.body.order.unitPrice)
    const order = new Order({
      ...req.body,
      order: {
        ...req.body.order,
        total,
      }
    })

    await order.save()
    sendSuccess(res, order, 201)
  } catch (error) {
    next(error)
  }
}

export const updateOrder = async (req, res, next) => {
  try {
    const { id } = req.params

    if (!isValidObjectId(id)) {
      return sendError(res, 'Invalid order ID', 400)
    }

    const { isValid, errors } = validateOrder(req.body)
    if (!isValid) {
      return sendValidationError(res, errors)
    }

    const total = (req.body.order.quantity * req.body.order.unitPrice)
    const order = await Order.findByIdAndUpdate(
      id,
      {
        ...req.body,
        order: {
          ...req.body.order,
          total,
        },
        updatedAt: new Date(),
      },
      { new: true, runValidators: true }
    )

    if (!order) {
      return sendNotFound(res, 'Order not found')
    }

    sendSuccess(res, order)
  } catch (error) {
    next(error)
  }
}

export const deleteOrder = async (req, res, next) => {
  try {
    const { id } = req.params

    if (!isValidObjectId(id)) {
      return sendError(res, 'Invalid order ID', 400)
    }

    const order = await Order.findByIdAndDelete(id)
    if (!order) {
      return sendNotFound(res, 'Order not found')
    }

    sendSuccess(res, { message: 'Order deleted successfully' })
  } catch (error) {
    next(error)
  }
}

export const getOrderStats = async (req, res, next) => {
  try {
    const totalOrders = await Order.countDocuments()
    const totalRevenue = await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$order.total' } } }
    ])
    const completedOrders = await Order.countDocuments({ 'order.status': 'Completed' })

    sendSuccess(res, {
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      completedOrders,
      averageOrderValue: totalOrders > 0 ? (totalRevenue[0]?.total || 0) / totalOrders : 0,
    })
  } catch (error) {
    next(error)
  }
}
