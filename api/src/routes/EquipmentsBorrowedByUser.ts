import { createRouter, HTTPStatus, ObjectId, Result } from 'aeria'
export const equipmentRouter = createRouter()
import { getEquipmentBorrowedByUserContract } from '../contracts/getEquipmentsBorrowedByUser.js'

equipmentRouter.POST(
  '/getEquipmentsBorrowedByUser',
  async (context) => {
    const { employeeId } = context.request.payload

    if (!employeeId) {
      return context.error(HTTPStatus.NotFound, {
        code: 'USER_ID_NOT_FOUND',
      })
    }

    // Simulação de dados emprestados armazenados na coleção EquipmentRelease
    const borrowedEquipments = await context.collections.equipmentRelease.model.aggregate([
      {
        $match: {
          delivered_to: new ObjectId(employeeId),
        },
      },
      {
        $lookup: {
          from: 'asset',
          localField: 'equipments',
          foreignField: '_id',
          as: 'equipmentsArray',
        },
      },
      {
        $project: {
          _id: 0,
          equipmentsArray: 1,
        },
      },
    ]).toArray()

    if (borrowedEquipments.length === 0) {
      return context.error(HTTPStatus.NotFound, {
        code: 'NO_EQUIPMENTS_FOUND',
      })
    }

    return Result.result(borrowedEquipments)
  }, getEquipmentBorrowedByUserContract,
)
