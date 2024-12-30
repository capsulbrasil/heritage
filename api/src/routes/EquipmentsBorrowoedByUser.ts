import { createRouter, HTTPStatus, Result } from "aeria";
export const equipmentRouter = createRouter();

equipmentRouter.POST(
    "/getEquipmentsBorrowoedByUser",
    async (context) => {
        const employeeId = context.token?.sub;

        if (!employeeId) {
            return context.error(HTTPStatus.NotFound, { code: "USER_ID_NOT_FOUND" });
        }

        // Simulação de dados emprestados armazenados na coleção EquipmentRelease
        const borrowedEquipments = await context.collections.equipmentRelease.model.aggregate([
            {
                $match: { delivered_to: employeeId },
            },
            {
                $project: {
                    equipments: {
                        $reduce: {
                            input: "$equipments",
                            initialValue: [],
                            in: { $concatArrays: ["$$value", "$$this"] },
                        },
                    },
                },
            },
        ]).toArray();

        if (!borrowedEquipments || borrowedEquipments.length === 0) {
            return context.error(HTTPStatus.NotFound, { code: "NO_EQUIPMENTS_FOUND" });
        }

        return Result.result(borrowedEquipments);
    }
);
