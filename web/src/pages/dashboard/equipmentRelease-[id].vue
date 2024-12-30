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
            _id: employeeProps.id
        }
    })
    if (employeeError) {
        return
    }
    employee.value = employeeResult

    const { error: equipmentReleaseError, result: equipmentReleaseResult } = await aeria.equipmentRelease.getAll.POST({
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
                            <p>Email corporativo: nikolas@gmail.com</p>
                            <p>Telefone Pessoal: 3443434343</p>
                        </div>
                        <!-- Status -->
                        <div>
                            <p>Status do Funcionário: <span class="tw-font-bold">Ativo ou Desativado</span></p>
                            <p>Data de Admissão: <span class="tw-font-bold">23/03/2033</span></p>
                            <p>Data de Demissão: <span class="tw-font-bold">23/03/2023</span></p>
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
                        <tr class="tw-border-b tw-border-gray-700">
                            <td class="tw-py-2 tw-px-4">Notebook Nitro AN515-58</td>
                            <td class="tw-py-2 tw-px-4">000552</td>
                            <td class="tw-py-2 tw-px-4">22/12/2024</td>
                            <td class="tw-py-2 tw-px-4">23/12/2024</td>
                        </tr>
                        <tr>
                            <td class="tw-py-2 tw-px-4">Monitor Acer 324242</td>
                            <td class="tw-py-2 tw-px-4">034500</td>
                            <td class="tw-py-2 tw-px-4">11/12/2024</td>
                            <td class="tw-py-2 tw-px-4">Não recolhido</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>