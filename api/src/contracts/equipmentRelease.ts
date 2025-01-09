import {
  defineContract,
  genericEndpointErrorSchema,
  resultSchema,
} from "aeria";

export const equipmentReleaseDataContract = defineContract({
  payload: {
    type: "object",
    properties: {
      offset: {
        type: "number",
      },
    },
  },
  response: [
    genericEndpointErrorSchema(),
    resultSchema({
      type: "array",
      items: {
        $ref: "employee",
        type: "object",
      },
    }),
  ],
});
