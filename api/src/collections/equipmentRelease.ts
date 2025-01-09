import {
  ACError,
  CollectionItemWithId,
  HTTPStatus,
  insert as originalInsert,
  InsertPayload,
  Result,
  SchemaWithId,
  EndpointError,
} from "aeria";
import type { equipmentReleaseCollection } from "../../.aeria/out/collections/equipmentRelease.mjs";
import { extendEquipmentReleaseCollection } from "../../.aeria/out/collections/equipmentRelease.mjs";
import { equipmentReleaseDataContract } from "../contracts/equipmentRelease.js";
import { getEquipmentBorrowedByUserContract } from "../contracts/getEquipmentsBorrowedByUser.js";

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
      equipments: {
        type: "array",
        items: {
          $ref: "asset",
          indexes: ["name", "code"],
          constraints: {
            operator: "equal",
            term1: "was_collected",
            term2: true,
          },
        },
      },
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
    presets: ["add", "crud"],
  },
  functions: {
    insert: async (
      payload: InsertPayload<
        SchemaWithId<equipmentReleaseCollection["description"]>
      >,
      context
    ): Promise<
      Result.Either<EndpointError, Partial<equipmentReleaseCollection>>
    > => {
      if (payload.what._id) {
        const { error, result } =
          await context.collections.equipmentRelease.functions.get({
            filters: {
              _id: payload.what._id,
            },
          });
        if (error) {
          return Result.error(error);
        }
        for (const equipment of result.equipments) {
          const { error } = await context.collections.asset.functions.insert({
            what: {
              _id: equipment._id,
              was_collected:
                payload.what.was_collected !== null ||
                payload.what.was_collected !== undefined
                  ? payload.what.was_collected
                  : result.was_collected,
            },
          });
          if (error) {
            continue;
          }
        }
      }
      if (payload.what.equipments && payload.what.was_collected) {
        for (const equipment of payload.what.equipments) {
          const { error } = await context.collections.asset.functions.insert({
            what: {
              _id: equipment,
              was_collected: payload.what.was_collected,
            },
          });
          if (error) {
            continue;
          }
        }
      }
      return originalInsert(payload, context) as any;
    },
    getGroupedByDeliveredTo: async (_, context) => {
      if (!context.token.authenticated) {
        return context.error(HTTPStatus.Forbidden, {
          code: ACError.AuthorizationError,
        });
      }

      const groupedData: CollectionItemWithId<"employee">[] =
        (await context.collections.equipmentRelease.model
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
              $sort: {
                allocation_date: 1,
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
            {
              $skip: 0,
            },
            {
              $limit: 10,
            },
          ])
          .toArray()) as unknown as CollectionItemWithId<"employee">[];

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
    getGroupedByDeliveredTo: equipmentReleaseDataContract,
  },
  exposedFunctions: {
    getGroupedByDeliveredTo: true,
  },
});
