<script setup lang="ts">
import { type CollectionItemWithId } from '@aeriajs/types';

definePage({
    props: true,
    meta: { title: 'Perfil do Funcionário' },
});

const employeeProps = defineProps<Props>()

const employee = ref({} as CollectionItemWithId<'employee'>)
const equipments = ref<CollectionItemWithId<'equipmentRelease'>[]>([])

type Props = {
    id: String
}

onMounted(async () => {
    const { error: employeeError, result: employeeResult } = await aeria().employee.get.POST({
        filters: {
            _id: employeeProps.id
        }
    })
    if (employeeError) {
        return
    }
    employee.value = employeeResult

    const { error: equipmentReleaseError, result: equipmentReleaseResult } = await aeria().equipmentRelease.getAll.POST({
        filters: {
            delivered_to: employeeProps.id,
        }
    })
    if (equipmentReleaseError) {
        return
    }
    equipments.value = equipmentReleaseResult.data
})

</script>

<template>

    <div v-if="employee && equipments">
        <div class="tw-bg-[color:var(--theme-background-color-shade-5)] tw-shadow tw-rounded-lg tw-mx-auto tw-flex tw-flex-col tw-items-start tw-p-4">
            <div class="tw-flex tw-flex-col tw-items-center">
            <aeria-picture
                class="tw-overflow-hidden tw-rounded-full tw-w-32 tw-h-32 tw-shadow-md tw-border-4 tw-border-white"
                :url="employee.picture_file?.link" alt="picture" />
            </div>
        </div>
    </div>
</template>