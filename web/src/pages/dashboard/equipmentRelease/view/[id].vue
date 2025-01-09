<script setup lang="ts">
import { type CollectionItemWithId } from '@aeriajs/types';
import { useStore } from 'aeria-ui';
import { ref, onMounted } from 'vue';

definePage({ props: true, meta: { title: 'Perfil do Funcionário' } });

const panelVisible = ref(false);
const metaStore = useStore('meta');
const employeeStore = useStore('employee');

type Props = { id: string };
const employeeProps = defineProps<Props>();
const editPanel = ref(false);

const openEditPanel = () => {
  employeeStore.$actions.setItem(employee.value);
  editPanel.value = true;
};

const employee = ref({} as CollectionItemWithId<'employee'>);
const equipments = ref<CollectionItemWithId<'equipmentRelease'>[]>([]);
const asset = ref<CollectionItemWithId<'asset'> | null>(null);

async function fetchAssetById(assetId: string) {
  const { error: assetError, result: assetResult } = await aeria.asset.get.POST({ filters: { _id: assetId } });
  if (assetError) {
    metaStore.$actions.spawnModal({ title: 'Ops...', body: 'Erro ao buscar informações do asset: ' + assetError.message || assetError.code });
    return;
  }
  asset.value = assetResult;
}

onMounted(async () => {
  const { error: employeeError, result: employeeResult } = await aeria.employee.get.POST({ filters: { _id: employeeProps.id } });
  if (employeeError) {
    metaStore.$actions.spawnModal({ title: 'Ops...', body: 'Erro ao buscar informações do funcionário:' + employeeError.message || employeeError.code });
    return;
  }
  employee.value = employeeResult;

  const { error: equipmentReleaseError, result: equipmentReleaseResult } = await aeria.equipmentRelease.getAll.POST({ filters: { delivered_to: employeeProps.id } });
  if (equipmentReleaseError) {
    metaStore.$actions.spawnModal({ title: 'Ops...', body: 'Erro ao buscar objetos do funcionário:' + equipmentReleaseError.message || equipmentReleaseError.code });
    return;
  }
  equipments.value = equipmentReleaseResult.data;
});
</script>

<template>
  <div v-if="hasRoles(['root', 'rh'])" class="tw-flex tw-flex-wrap tw-gap-2 tw-justify-end">
    <aeria-button icon="pencil" @click="openEditPanel">Editar</aeria-button>
  </div>

  <div v-if="employee && equipments">
    <div
      class="tw-shadow tw-rounded-lg tw-mx-auto tw-p-4 tw-flex tw-flex-col tw-space-y-4 tw-bg-[color:var(--theme-background-color-shade-5)]">
      <div class="tw-flex tw-items-center tw-space-x-4">
        <div class="tw-flex tw-items-center tw-justify-center tw-bg-gray-700 tw-w-24 tw-h-24 tw-rounded-full">
          <aeria-picture
            class="tw-overflow-hidden tw-rounded-full tw-w-24 tw-h-24 tw-shadow-md tw-border-4 tw-border-white"
            :url="employee.picture_file?.link" alt="Foto do Funcionário" />
        </div>
        <div class="tw-flex-1">
          <div class="tw-grid tw-grid-cols-2 tw-gap-4">
            <div>
              <p class="tw-font-bold">Nome: {{ employee.name }}</p>
              <p>Email corporativo: {{ employee.corporate_email }}</p>
              <p>Telefone Pessoal: {{ employee.contact }}</p>
            </div>
            <div>
              <div v-if="employee.is_active == true">
                <p>Status do Funcionário: <span class="tw-font-bold">Ativo</span></p>
                <p>Data de Admissão: <span class="tw-font-bold">{{ formatDateTime(employee.admission_date) }}</span></p>
              </div>
              <div v-else>
                <p>Status do Funcionário: <span class="tw-font-bold">Inativo</span></p>
                <p>Data de Admissão: <span class="tw-font-bold">{{ formatDateTime(employee.admission_date) }}</span></p>
                <p>Data de Demissão: <span class="tw-font-bold">{{ formatDateTime(employee.exit_date) }}</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="tw-rounded-lg tw-p-4 tw-shadow-md tw-bg-[color:var(--theme-background-color-shade-2)]">
        <table class="tw-w-full tw-table-auto tw-text-left tw-text-sm">
          <thead class="tw-border-b tw-border-gray-700">
            <tr>
              <th class="tw-py-2 tw-px-4">Recurso Atribuído</th>
              <th class="tw-py-2 tw-px-4">Patrimônio</th>
              <th class="tw-py-2 tw-px-4">Data de Alocação</th>
              <th class="tw-py-2 tw-px-4">Data de Recolhimento</th>
              <th class="tw-py-2 tw-px-4">Quem entregou</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="equipment in equipments" :key="equipment._id">
              <tr v-for="equipmentAsset in equipment.equipments" :key="equipmentAsset._id.toString()"
                class="tw-border-b tw-border-gray-700">
                <td class="tw-py-2 tw-px-4">
                  <div class="tw-flex tw-items-center tw-gap-2">
                    <button class="tw-w-8 tw-h-8 tw-flex tw-items-center tw-justify-center tw-bg-transparent hover:tw-bg-gray-500 tw-rounded-full 
         tw-transition-colors tw-duration-300 tw-cursor-pointer"
                      @click="fetchAssetById(equipmentAsset._id.toString()); panelVisible = true">
                      <aeria-icon icon="info"
                        style="--icon-size: 1.2rem; --icon-color: var(--theme-foreground-color);"></aeria-icon>
                    </button>
                    {{ equipmentAsset.name }}
                  </div>
                </td>
                <td class="tw-py-2 tw-px-4">{{ equipmentAsset.code }}</td>
                <td class="tw-py-2 tw-px-4">{{ formatDateTime(equipment.allocation_date) }}</td>
                <td class="tw-py-2 tw-px-4">
                  <span v-if="!equipment.collection_date">Não Recolhido</span>
                  <span v-else>{{ formatDateTime(equipment.collection_date) }}</span>
                </td>
                <td class="tw-py-2 tw-px-4"><span>{{ equipment.delivered_by.name }}</span></td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <aeria-panel v-model="panelVisible" float close-hint title="Asset Details" @overlay-click="panelVisible = false">
    <div v-if="asset" class="tw-w-full tw-h-full tw-flex tw-flex-col tw-items-center">
      <h1 class="tw-text-2xl tw-font-bold tw-text-center tw-mb-4">{{ asset.name }}</h1>
      <div class="tw-w-full tw-max-w-md tw-space-y-4">
        <div class="tw-flex tw-justify-between tw-border-b tw-pb-2">
          <div class="tw-flex tw-items-center">
            <aeria-icon icon="barcode" class="tw-mr-2" />
            <span class="tw-font-bold">Nº de Série:</span>
          </div>
          <span>{{ asset.code }}</span>
        </div>
        <div class="tw-flex tw-justify-between tw-border-b tw-pb-2">
          <div class="tw-flex tw-items-center">
            <aeria-icon icon="package" class="tw-mr-2" />
            <span class="tw-font-bold">Inclui Acessórios:</span>
          </div>
          <span>{{ asset.includes_accessories ? 'Sim' : 'Não' }}</span>
        </div>
        <div class="tw-flex tw-justify-between tw-border-b tw-pb-2">
          <div class="tw-flex tw-items-center">
            <aeria-icon icon="user" class="tw-mr-2" />
            <span class="tw-font-bold">Registrado por:</span>
          </div>
          <span>{{ asset.registered_by?.name }}</span>
        </div>
        <div class="tw-flex tw-justify-between">
          <div class="tw-flex tw-items-center">
            <aeria-icon icon="read-cv-logo" class="tw-mr-2" />
            <span class="tw-font-bold">Observação:</span>
          </div>
          <span>{{ asset.observation || 'Nenhuma' }}</span>
        </div>
      </div>
    </div>
    <template #footer>
      <div class="tw-w-full tw-flex tw-justify-end tw-px-6 tw-py-4">
        <aeria-button large class="tw-bg-blue-900 tw-text-white" @click="panelVisible = false">Fechar</aeria-button>
      </div>
    </template>
  </aeria-panel>

  <aeria-insert-panel v-if="editPanel" v-model:visible="editPanel" fixed-right close-hint collection="employee"
    title="Editar colaborador" @cancel="editPanel = false"
    @insert="employee = $event as CollectionItemWithId<'employee'>" />
</template>