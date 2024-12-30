import { createRouter } from 'aeria'
import { equipmentRouter } from './EquipmentsBorrowoedByUser.js'

export const router = createRouter()
router.group('/getEquipmentsBorrowoedByUser', equipmentRouter)

