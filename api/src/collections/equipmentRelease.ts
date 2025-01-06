import { extendEquipmentReleaseCollection } from "../../.aeria/out/collections/equipmentRelease.mjs";

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
    formLayout: {
      fields: {
        collection_date: {
          if: {
            operator: "equal",
            term1: "was_collected",
            term2: true,
          },
        },
      },
    },
  },
});
