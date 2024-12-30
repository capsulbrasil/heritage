<script setup lang="ts">
import { type CollectionItemWithId } from '@aeriajs/types';

definePage({
    props: true,
    meta: {
        title: 'Equipment Release',
        icon: 'gauge',
    },
});

const employeeProps = defineProps<Props>()

const employee = ref({} as CollectionItemWithId<'employee'>)
const equipments = ref<CollectionItemWithId<'equipmentRelease'>[]>([])

const router = useRouter();

type Props = {
    id: String
}

const navigateToEquipment = (id: string) => {
    router.push(`/dashboard/equipmentRelease-${id}`);
};

</script>

<template>
    <div v-if="employee && equipments" class="tw-flex tw-flex-col tw-gap-4">
        <aeria-crud collection="equipmentRelease" class="tw-cursor-pointer">
            <template #row-delivered_to="{ row, column }">
                <div class="tw-flex tw-flex-col tw-gap-1">
                    <div class="tw-cursor-pointer linked-text tw-w-min tw-whitespace-pre tw-flex "
                        @click="navigateToEquipment(row.delivered_to._id)" v-if="row[column]?.is_active == true">
                        <aeria-icon icon="check-circle" style="--icon-color: green; --icon-size: 1.2rem;"
                            class="tw-text-[12pt]">{{ row[column]?.name || "-" }}
                        </aeria-icon>   
                    </div>  
                    <div class="tw-cursor-pointer linked-text tw-w-min tw-whitespace-pre"
                        @click="navigateToEquipment(row.delivered_to._id)" v-else>
                        <aeria-icon icon="x-circle" style="--icon-color: red; --icon-size: 1.2rem;"
                            class="tw-text-[12pt]">{{ row[column]?.name || "-" }}
                        </aeria-icon>
                    </div>
                    <div class="tw-text-[10pt] tw-opacity-60 tw-cursor-pointer linked-text" @click="navigateToEquipment(row.delivered_to._id)">
                        {{ row[column]?.contact || "-" }} -
                        {{ row[column]?.corporate_email }}
                    </div>
                </div>
            </template>
            <template #row-delivered-by="{ row, column }">
                <div class="tw-flex tw-flex-col tw-gap-1">
                    <div class="tw-w-min tw-whitespace-pre tw-flex tw-text-[12pt]">
                        {{ row[column]?.name }}
                    </div>
                </div>
            </template>
        </aeria-crud>
    </div>
</template>