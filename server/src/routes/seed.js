import express from 'express'
import { seedDatabase } from '../controllers/seedController.js'
import { asyncHandler } from '../middleware/errorHandler.js'

const router = express.Router()

router.post('/', asyncHandler(seedDatabase))

export default router
