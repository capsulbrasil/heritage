import {
  defineContract,
  genericEndpointErrorSchema,
  resultSchema,
} from "aeria";

export const equipmentReleaseDataContract = defineContract({
  properties: {
    delivered_to: {
      type: "string",
    },
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
