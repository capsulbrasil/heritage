import { createRouter, HTTPStatus, Result } from "aeria";
export const equipmentRouter = createRouter();

equipmentRouter.POST(
  "/getEquipmentsBorrowoedByUser",
  async (context) => {
    const employeeId = context.token?.sub;

    if (!employeeId) {
      return context.error(HTTPStatus.NotFound, { code: "USER_ID_NOT_FOUND" });
    }

    try {
      // Simulação de dados emprestados armazenados na coleção EquipmentRelease
      const borrowedEquipments = await context.collections.equipmentRelease.model.aggregate([
        {
          $match: { "delivered_to._id": employeeId }, // Filtra lançamentos pelo ID do funcionário
        },
        {
          $project: {
            equipments: {
              $reduce: {
                input: "$equipments", // Campo contendo os equipamentos
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
    } catch (error) {
      return context.error(HTTPStatus.InternalServerError, {
        code: "ERROR_FETCHING_EQUIPMENTS",
        message: "An unexpected error occurred",
      });
    }
  },
  {
    roles: true,
    payload: {
      type: "object",
      properties: {},
    },
  }
);
