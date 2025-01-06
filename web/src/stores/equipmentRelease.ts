import { createStore, createCollectionStore } from "aeria-ui";

export const equipmentStore = createStore((context) =>
  createCollectionStore(
    {
      $id: "equipmentRelease", // Identificador da coleção
      state: {}, // Estado inicial
      actions: () => ({
        viewContent(equipment: { _id: string }) {
          //@ts-ignore
          ROUTER.push({
            path: "/dashboard/equipmentRelease-" + equipment._id, // Rota para equipamento
          });
        },
      }),
    },
    context
  )
);
