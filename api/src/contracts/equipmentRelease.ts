import { defineContract, genericEndpointErrorSchema, resultSchema, } from "aeria";

export const equipmentReleaseDataContract = defineContract({
  payload: {
    type: 'object',
    properties: {
      search: {
        type: 'string'
      },
      offset:{
        type:'number'
      }
    }
  },
  response: [
    genericEndpointErrorSchema(),
    resultSchema({
      type: "object",
      properties:{
        pagination:{
          type:'object',
          properties:{
            offset: {
              type:'number'
            },
            recordsTotal:{
              type:'number'
            },
            limit:{
              type:'number'
            },
            recordsCount:{
              type:'number'
            }
          }
        },
        data:{
          type:'array',
          items: {
            $ref: "employee",
          }
        }
      }
    }),
  ],
});
