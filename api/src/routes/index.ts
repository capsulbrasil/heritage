import { createRouter } from 'aeria'
import { equipmentRouter } from './EquipmentsBorrowedByUser.js'

export const router = createRouter()
router.group('/equipmentEmployee', equipmentRouter)
