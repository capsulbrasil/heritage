import { extendEquipmentReleaseCollection } from '../../.aeria/out/collections/equipmentRelease.mjs'

export const equipmentRelease = extendEquipmentReleaseCollection({
  description: {
    formLayout: {
      fields: {
        collection_date: {
          if: {
            operator: 'equal',
            term1: 'was_collected',
            term2: true,
          },
        },
      },
    },
  },
})
