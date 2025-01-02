<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useStore } from 'aeria-ui'
import { type CollectionItemWithId } from '@aeriajs/types'

definePage({
    props: true,
    meta: {
        title: 'Perfil do Asset',
    },
})

type Props = {
    id: string
}

const metaStore = useStore('meta')
const assetProps = defineProps<Props>()
const assets = ref<CollectionItemWithId<'asset'>[]>([])

onMounted(async () => {

    const { error: assetError, result: assetResult } = await aeria.asset.getAll.POST({
        filters: {
            _id: assetProps.id,
        },
    })

    if (assetError) {
        metaStore.$actions.spawnModal({
            title: 'Ops...',
            body: 'Erro ao buscar objetos do funcionário:' + assetError.message || assetError.code,
        })
        return
    }

    assets.value = assetResult.data
})
</script>

<template>
    <div v-if="assets" class="tw-flex tw-justify-center tw-items-start">
        <div v-for="asset in assets" class="tw-flex tw-flex-col tw-items-center tw-bg-blue-950 tw-text-white tw-rounded-lg tw-p-6 tw-shadow-lg tw-w-96">
            <h1 class="tw-text-xl tw-font-bold">{{ asset.name }}</h1>
            <div class="tw-flex tw-items-center">
                <aeria-icon icon="barcode" class="tw-mr-2"></aeria-icon>
                <p><span class="tw-font-bold">Nº de Série:</span> {{ asset.code }}</p>
            </div>
            <div class="tw-flex tw-items-center">
                <aeria-icon icon="package" class="tw-mr-2"></aeria-icon>
                <p><span class="tw-font-bold">Inclui Acessórios:</span> {{ asset.includes_accessories ? 'Sim' : 'Não' }}</p>
            </div>
            <div class="tw-flex tw-items-center">
                <aeria-icon icon="user" class="tw-mr-2"></aeria-icon>
                <p><span class="tw-font-bold">Registrado por:</span> {{ asset.registered_by?.name }}</p>
            </div>
            <div class="tw-flex tw-items-cente">
                <aeria-icon icon="read-cv-logo" class="tw-mr-2"></aeria-icon>
                <p><span class="tw-font-bold">Observação:</span> {{ asset.observation || 'Nenhuma' }}</p>
            </div>
        </div>
    </div>
    <div v-else>
        <p class="tw-text-center tw-text-gray-400">Carregando informações do asset...</p>
    </div>
</template>

<style scoped>
.tw-shadow-lg {
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.3);
}
</style>
