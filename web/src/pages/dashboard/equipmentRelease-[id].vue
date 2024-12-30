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
    const { error: employeeError, result: employeeResult } = await aeria.employee.get.POST({
        filters: {
            _id: employeeProps.id,
        },
    });
    if (employeeError) {
        return;
    }
    employee.value = employeeResult;

    const { error: equipmentReleaseError, result: equipmentReleaseResult } = await aeria.equipmentRelease.getAll.POST({
        filters: {
            delivered_to: employeeProps.id,
        },
    });
    if (equipmentReleaseError) {
        return;
    }


    equipments.value = equipmentReleaseResult.data.flatMap((item: any) =>
        item.equipments.map((equipment: any) => ({
            name: equipment.name,
            code: equipment.code,
            allocation_date: item.allocation_date,
            collection_date: item.collection_date,
        }))
    );
});

</script>

<template>
    <div v-if="employee && equipments">
        <div
            class="tw-bg-[color:var(--theme-background-color-shade-5)] tw-shadow tw-rounded-lg tw-mx-auto tw-p-4 tw-flex tw-flex-col tw-space-y-4">
            <!-- Linha principal com imagem e informações -->
            <div class="tw-flex tw-items-center tw-space-x-4">
                <!-- Imagem do perfil -->
                <div class="tw-flex tw-items-center tw-justify-center tw-bg-gray-700 tw-w-24 tw-h-24 tw-rounded-full">
                    <aeria-picture
                        class="tw-overflow-hidden tw-rounded-full tw-w-24 tw-h-24 tw-shadow-md tw-border-4 tw-border-white"
                        :url="employee.picture_file?.link" alt="Foto do Funcionário" />
                </div>

                <!-- Informações do funcionário -->
                <div class="tw-flex-1">
                    <div class="tw-grid tw-grid-cols-2 tw-gap-4">
                        <!-- Informações principais -->
                        <div>
                            <p class="tw-font-bold">Nome: {{ employee.name }}</p>
                            <p>Email corporativo: {{ employee.corporate_email }}</p>
                            <p>Telefone Pessoal: {{ employee.contact }}</p>
                        </div>
                        <!-- Status -->
                        <div>
                            <div v-if="employee.is_active == true">
                                <p>Status do Funcionário:
                                    <span class="tw-font-bold">Ativo</span>
                                <p>Data de Admissão: <span class="tw-font-bold">{{
                                    formatDateTime(employee.admission_date) }}</span></p>
                                </p>
                            </div>
                            <div v-else>
                                <p>Status do Funcionário:
                                    <span class="tw-font-bold">Inativo</span>
                                <p>Data de Admissão: <span class="tw-font-bold">{{
                                    formatDateTime(employee.admission_date) }}</span></p>
                                <p>Data de Demissão: <span class="tw-font-bold">{{ formatDateTime(employee.exit_date)
                                        }}</span></p>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Tabela de recursos -->
            <div class="tw-bg-[color:var(--theme-background-color-shade-2)] tw-rounded-lg tw-p-4 tw-shadow-md ">
                <table class="tw-w-full tw-table-auto tw-text-left tw-text-sm">
                    <thead class="tw-border-b tw-border-gray-700">
                        <tr>
                            <th class="tw-py-2 tw-px-4">Recurso Atribuído</th>
                            <th class="tw-py-2 tw-px-4">Patrimônio</th>
                            <th class="tw-py-2 tw-px-4">Data de Alocação</th>
                            <th class="tw-py-2 tw-px-4">Data de Recolhimento</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="equipment in equipments" :key="equipment._id"
                            class="tw-border-b tw-border-gray-700">
                            <td class="tw-py-2 tw-px-4">{{ equipment.name }}</td>
                            <td class="tw-py-2 tw-px-4">{{ equipment.code }}</td>
                            <td class="tw-py-2 tw-px-4">{{ formatDateTime(equipment.allocation_date) }}</td>
                            <td class="tw-py-2 tw-px-4">
                                <span v-if="!equipment.collection_date">Não Recolhido</span>
                                <span v-else>{{ formatDateTime(equipment.collection_date) }}</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
