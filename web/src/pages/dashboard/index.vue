<script setup lang="ts">
import { type CollectionItemWithId } from '@aeriajs/types'

definePage({
  props: true,
  meta: {
    title: 'Equipment Release',
    icon: 'gauge',
  },
})

defineProps<Props>()

const employee = ref({} as CollectionItemWithId<'employee'>)
const equipments = ref({} as CollectionItemWithId<'equipmentRelease'>[])

const router = useRouter()

type Props = {
  id: String
}

const navigateToEquipment = (id: string) => {
  router.push(`/dashboard/equipmentRelease-${id}`)
}

</script>

<template>
  <div v-if="employee && equipments" class="tw-flex tw-flex-col tw-gap-4">
    <aeria-crud collection="equipmentRelease" class="tw-cursor-pointer">
      <template #row-delivered_to="{ row, column }">
        <div class="tw-flex tw-flex-col tw-gap-1">
          <div 
            v-if="row[column]?.is_active == true" 
            class="tw-cursor-pointer linked-text tw-w-min tw-whitespace-pre" 
            @click="navigateToEquipment(row.delivered_to._id)">
            <aeria-icon 
              icon="check-circle" 
              style="--icon-color: green; --icon-size: 1.2rem;" 
              class="tw-text-[12pt]">
              {{ row[column]?.name || "-" }}
            </aeria-icon>
            <div 
              class="tw-text-[10pt] tw-opacity-60 tw-cursor-pointer linked-text" 
              @click="navigateToEquipment(row.delivered_to._id)">
              {{ row[column]?.contact || "-" }} - {{ row[column]?.corporate_email }}
            </div>
          </div>
          <div 
            v-else 
            class="tw-cursor-pointer linked-text tw-w-min tw-whitespace-pre tw-opacity-50" 
            @click="navigateToEquipment(row.delivered_to._id)">
            <aeria-icon 
              icon="x-circle" 
              style="--icon-color: red; --icon-size: 1.2rem;" 
              class="tw-text-[12pt]">
              {{ row[column]?.name || "-" }}
            </aeria-icon>
            <div 
              class="tw-text-[10pt] tw-opacity-60 tw-cursor-pointer linked-text" 
              @click="navigateToEquipment(row.delivered_to._id)">
              {{ row[column]?.contact || "-" }} - {{ row[column]?.corporate_email }}
            </div>
          </div>
        </div>
      </template>
    </aeria-crud>
  </div>
</template>