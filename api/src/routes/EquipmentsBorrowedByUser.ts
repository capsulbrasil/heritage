import { createRouter, HTTPStatus, Result } from "aeria";
export const equipmentRouter = createRouter();

equipmentRouter.POST(
    "/getEquipmentsBorrowedByUser",
    async (context) => {
        const employeeId = context.token?.sub;

        if (!employeeId) {
            return context.error(HTTPStatus.NotFound, { code: "USER_ID_NOT_FOUND" });
        }

        // Simulação de dados emprestados armazenados na coleção EquipmentRelease
        const borrowedEquipments = await context.collections.equipmentRelease.model.aggregate([
            {
                $match: {
                    delivered_to: employeeId
                }
            },
            {
                $lookup: {
                    from: 'asset',
                    localField: 'equipments',
                    foreignField: '_id',
                    as: 'equipmentsArray'
                }
            },
            {
                $unwind: {
                    path: '$equipmentsArray'
                }
            },
            {
                $project: {
                    _id: 0,
                    equipmentsArray: 1
                }
            },
        ]).toArray();

        if (!borrowedEquipments || borrowedEquipments.length === 0) {
            return context.error(HTTPStatus.NotFound, { code: "NO_EQUIPMENTS_FOUND" });
        }

        return Result.result(borrowedEquipments);
    }
);