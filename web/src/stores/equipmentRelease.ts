import { createStore, createCollectionStore } from 'aeria-ui'
import type { CollectionItemWithId } from '@aeriajs/types'

export const equipmentStore = createStore((context) =>
  createCollectionStore(
    {
      $id: 'equipmentRelease', // Identificador da coleção
      state: {}, // Estado inicial
      actions: () => ({
        viewContent(equipment: Pick<CollectionItemWithId<'equipmentRelease'>, '_id' | 'delivered_to'>) {
          ROUTER.push({
            path: '/dashboard/equipmentRelease/view/' + equipment.delivered_to._id, // Rota para equipamento
          })
        },
      }),
    },
    context,
  ))
