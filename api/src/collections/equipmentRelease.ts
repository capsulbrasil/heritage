import { ACError, HTTPStatus, Result } from "aeria";
import { extendEquipmentReleaseCollection } from "../../.aeria/out/collections/equipmentRelease.mjs";
import { equipmentReleaseDataContract } from "../contracts/equipmentRelease.js";

export const equipmentRelease = extendEquipmentReleaseCollection({
  description: {
    individualActions: {
      viewContent: {
        label: "Ver Mais",
        icon: "eye",
        requires: ["_id", "delivered_to"],
      },
    },
    properties: {
      delivered_to: {
        $ref: "employee",
        constraints: {
          operator: "equal",
          term1: "is_active",
          term2: true,
        },
      },
    },
    tableLayout: {
      actions: {
        viewContent: {
          button: true,
        },
      },
    },
    formLayout: {
      fields: {
        collection_date: {
          if: {
            operator: "equal",
            term1: "was_collected",
            term2: true,
          },
        },
      },
    },
    presets: ["add", "crud"],
  },

  functions: {
    getGroupedByDeliveredTo: async (context) => {
      if (!context.token.authenticated) {
        return context.error(HTTPStatus.Forbidden, {
          code: ACError.AuthorizationError,
        });
      }

      const groupedData = await context.collections.equipmentRelease.model
        .aggregate([
          {
            $lookup: {
              from: "employee",
              localField: "delivered_to",
              foreignField: "_id",
              as: "delivered_to",
            },
          },
          {
            $unwind: {
              path: "$delivered_to",
            },
          },
          {
            $group: {
              _id: "$delivered_to",
            },
          },
          {
            $replaceRoot: {
              newRoot: "$_id",
            },
          },
        ])
        .toArray();

      if (!groupedData) {
        console.error("Erro ao executar a agregação:", ACError);
        return context.error(HTTPStatus.InternalServerError, {
          code: ACError.UnknownError,
          message: "Erro ao agrupar dados por delivered_to.",
        });
      }
      return Result.result(groupedData);
    },
  },
  contracts: {
    equipmentReleaseData: equipmentReleaseDataContract,
  },
  exposedFunctions: {
    equipmentReleaseDataContract: true,
  },
});
