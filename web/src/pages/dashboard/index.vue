<script setup lang="ts">
import type { CollectionItemWithId } from '@aeriajs/types'

definePage({
  props: true,
  meta: {
    title: 'Equipment_Release',
    icon: 'gauge',
  },
})

const equipments = ref<CollectionItemWithId<'employee'>[]>([])
type employee = CollectionItemWithId<'employee'>;
const router = useRouter();

const navigateToEmployee = (id: string) => {
  router.push(`/dashboard/employeeDetail/view/${id}`);
};

onMounted(async () => {
  const { error, result } = await aeria().equipmentRelease.getGroupedByDeliveredTo.POST();
  if (error) {
    return
  }
  equipments.value = result
});

</script>
<template>
  <aeria-table>
    <template #thead>
      <tr>
        <th class="tw-text-left tw-py-2 tw-px-4">Entregue Para</th>
        <th class="tw-text-left tw-py-2 tw-px-4">Status</th>
      </tr>
    </template>
    <template #tbody>
      <tr v-for="employee in equipments" :key="employee._id.toString()" class="tw-border-b tw-border-gray-700">
        <td class="tw-py-2 tw-px-4">
          <div class="tw-flex tw-items-center tw-gap-2"
            :class="employee.is_active ? 'tw-cursor-pointer' : 'tw-cursor-not-allowed'">
            <aeria-icon :icon="employee.is_active ? 'check-circle' : 'x-circle'" :style="{
              '--icon-color': employee.is_active ? 'green' : 'red',
              '--icon-size': '1.2rem',
            }" class="tw-text-[12pt]" />
            <div class="tw-flex tw-flex-col">
              <span class="tw-font-bold" :class="employee.is_active ? 'tw-text-' : 'tw-opacity-50 tw-text-gray-400'">
                {{ employee.name || '-' }}
              </span>
              <span class="tw-text-[10pt]"
                :class="employee.is_active ? 'tw-text-gray-500' : 'tw-opacity-60 tw-text-gray-400'">
                {{ employee.contact || '-' }} - {{ employee.corporate_email || '-' }}
              </span>
            </div>
          </div>
        </td>
        <td class="tw-py-2 tw-px-4 tw-flex tw-items-center tw-justify-between">
          <span class="tw-font-bold" :class="employee.is_active ? 'tw-text-green-500' : 'tw-text-red-500'">
            {{ employee.is_active ? 'Ativo' : 'Inativo' }}
          </span>
          <button class="tw-cursor-pointer tw-flex tw-items-center tw-text-[color:var(--theme-text-color-shade-2)] tw-gap-2 tw-border tw-border-gray-400 
            tw-bg-transparent tw-px-3 tw-py-2 tw-rounded-lg tw-transition-all tw-duration-300 hover:tw-border-gray-300 
            focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-gray-500"
            @click="navigateToEmployee(employee._id.toString())">
            <aeria-icon icon="eye" style="--icon-color: var(--theme-foreground-color); --icon-size: 1rem;"
              class="tw-text-current" />
            <span>Ver Mais</span></button>
        </td>
      </tr>
    </template>
  </aeria-table>
</template>