import {
  defineContract,
  genericEndpointErrorSchema,
  resultSchema,
} from "aeria";

export const equipmentReleaseDataContract = defineContract({
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
