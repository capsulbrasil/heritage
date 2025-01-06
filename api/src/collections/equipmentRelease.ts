import { extendEquipmentReleaseCollection } from '../../.aeria/out/collections/equipmentRelease.mjs'

export const equipmentRelease = extendEquipmentReleaseCollection({
  description: {
    individualActions: {
      eye: {
        label: "Visualizar",
        icon: "eye",
      },
    },
    properties: {
      delivered_to: {
        $ref: 'employee',
        constraints: {
          operator: 'equal',
          term1: 'is_active',
          term2: true,
        }
      }
    },
    tableLayout:{
      actions: {
        eye: {
          button: true,
        },
      },
    },
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

