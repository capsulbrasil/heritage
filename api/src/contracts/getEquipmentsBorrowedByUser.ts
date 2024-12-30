import { defineContract, genericEndpointErrorSchema, resultSchema } from 'aeria'

export const getEquipmentBorrowedByUserContract = defineContract({
  payload: {
    type: 'object',
    properties: {
      employeeId: {
        type: 'string',
      },
    },
  },
  response: [
    genericEndpointErrorSchema(),
    resultSchema({
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: true,
      },
    }),
  ],
})
