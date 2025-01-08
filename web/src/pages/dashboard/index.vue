<script setup lang="ts">
import { type CollectionItemWithId } from '@aeriajs/types'

definePage({
  props: true,
  meta: {
    title: 'Equipment_Release',
    icon: 'gauge',
  },
})

const employee = ref({} as CollectionItemWithId<'employee'>)
const equipments = ref({} as CollectionItemWithId<'equipmentRelease'>[])


type Props = {
  id: String
}

onMounted(async () => {
});

</script>

<template>
  <div v-if="employee && equipments" class="tw-flex tw-flex-col tw-gap-4">
    <aeria-crud collection="equipmentRelease" class="tw-cursor-pointer">
      <template #row-delivered_to="{ row, column }">
        <div class="tw-flex tw-flex-col tw-gap-1">
          <div v-if="row[column]?.is_active == true" class="tw-cursor-default linked-text tw-w-min tw-whitespace-pre">
            <aeria-icon icon="check-circle" style="--icon-color: green; --icon-size: 1.2rem;" class="tw-text-[12pt]">
              {{ row[column]?.name || "-" }}
            </aeria-icon>
            <div class="tw-cursor-default tw-text-[10pt] tw-opacity-60 linked-text">
              {{ row[column]?.contact || "-" }} - {{ row[column]?.corporate_email }}
            </div>
          </div>
          <div v-else class="tw-cursor-not-allowed linked-text tw-w-min tw-whitespace-pre tw-opacity-40">
            <aeria-icon icon="x-circle" style="--icon-color: red; --icon-size: 1.2rem;" class="tw-text-[12pt]">
              {{ row[column]?.name || "-" }}
            </aeria-icon>
            <div class="tw-cursor-not-allowed tw-text-[10pt] tw-opacity-60 linked-text">
              {{ row[column]?.contact || "-" }} - {{ row[column]?.corporate_email }}
            </div>
          </div>
        </div>
      </template>
    </aeria-crud>
  </div>
</template>
