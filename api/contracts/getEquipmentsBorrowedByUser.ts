import { defineContract, endpointErrorSchema, HTTPStatus, resultSchema } from "aeria";

export const getEquipmentBorrowedByUserContract = defineContract({
  response: [
    endpointErrorSchema({
      httpStatus: [HTTPStatus.NotFound],
      code: ["NO_EQUIPMENTS_FOUND"]
    })
  ],
  resultSchema: {
    type: "object",
    properties: {
      equipmentsArray: {
        $ref: 'asset'
      }
    }
  }
});
