import { defineContract, genericEndpointErrorSchema, resultSchema, } from "aeria";

export const equipmentReleaseDataContract = defineContract({
  payload: {
    type: 'object',
    properties: {
      search: {
        type: 'string'
      }
    }
  },
  response: [
    genericEndpointErrorSchema(),
    resultSchema({
      type: "array",
      items: {
        $ref: "employee",
      },
    }),
  ],
});
