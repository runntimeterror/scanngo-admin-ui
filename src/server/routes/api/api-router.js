import express from 'express'
import InventoryRouter from './inventory-router.js'
const router = express.Router()

router.use('/api', InventoryRouter)

export default router