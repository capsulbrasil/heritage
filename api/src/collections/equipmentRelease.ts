import {
  ACError,
  CollectionItemWithId,
  HTTPStatus,
  insert as originalInsert,
  InsertPayload,
  Result,
  SchemaWithId,
  EndpointError,
  ObjectId,
} from "aeria";
import type { equipmentReleaseCollection } from "../../.aeria/out/collections/equipmentRelease.mjs";
import { extendEquipmentReleaseCollection } from "../../.aeria/out/collections/equipmentRelease.mjs";
import { equipmentReleaseDataContract } from "../contracts/equipmentRelease.js";

type EquipmentReleaseByUser = {
  pagination:{
    offset: number,
    recordsTotal:number,
    limit:number,
    recordsCount:number
  }
  data: CollectionItemWithId<'employee'>[]
}

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
      if (payload.what.delivered_to) {
        const employee = await context.collections.employee.model.findOne(
          {
            _id: new ObjectId(payload.what.delivered_to),
          },
          {
            projection: {
              name: 1,
            },
          }
        );

        if (employee) {
          payload.what.delivered_to_name = employee.name;
        }
      }

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
      if (payload.what.equipments) {
        for (const equipment of payload.what.equipments) {
          const { error } = await context.collections.asset.functions.insert({
            what: {
              _id: equipment,
              was_collected:
                payload.what.was_collected !== null ||
                payload.what.was_collected !== undefined
                  ? payload.what.was_collected
                  : false,
            },
          });
          if (error) {
            continue;
          }
        }
      }
      return originalInsert(payload, context) as any;
    },
    getGroupedByDeliveredTo: async (payload, context) => {
      const { search } = payload;

      if (!context.token.authenticated) {
        return context.error(HTTPStatus.Forbidden, {
          code: ACError.AuthorizationError,
        });
      }

      const groupedData: EquipmentReleaseByUser =
        (await context.collections.equipmentRelease.model
          .aggregate([
            ...(search
              ? [
                  {
                    $match: {
                      $text: {
                        $search: search,
                        $caseSensitive: false,
                      },
                    },
                  },
                ]
              : []),
            {
              $facet: {
                pagination: [
                  {
                    $lookup: {
                      from: "employee",
                      localField: "delivered_to",
                      foreignField: "_id",
                      as: "delivered_to"
                    }
                  },
                  {
                    $unwind: {
                      path: "$delivered_to"
                    }
                  },
                  {
                    $group: {
                      _id: "$delivered_to"
                    }
                  },
                  {
                    $replaceRoot: {
                      newRoot: "$_id"
                    }
                  },
                  {
                    $count: "recordsTotal"
                  }
                ],
                data: [
                  {
                    $lookup: {
                      from: "employee",
                      localField: "delivered_to",
                      foreignField: "_id",
                      as: "delivered_to"
                    }
                  },
                  {
                    $unwind: {
                      path: "$delivered_to"
                    }
                  },
                  {
                    $group: {
                      _id: "$delivered_to"
                    }
                  },
                  {
                    $replaceRoot: {
                      newRoot: "$_id"
                    }
                  },
                  {
                    $skip: payload.offset
                  },
                  {
                    $limit: 10
                  }
                ]
              }
            },
            {
              $addFields: {
                "pagination.offset": 0,
                "pagination.limit":10
              }
            },
            {
              $unwind: {
                path: "$pagination"
              }
            },
            {
              $project: {
                "pagination.recordsTotal":1,
                "pagination.recordsCount":{$size:"$data"},
                "pagination.offset":1,
                "pagination.limit":1,
                data:1
              }
            }
          ])
          .next()) as unknown as EquipmentReleaseByUser;

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
