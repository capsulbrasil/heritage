<script setup lang="ts">

definePage({
    meta: {
        title: 'Assets',
        icon: 'desktop-tower',
    },
})
</script>

<template>
  <aeria-crud collection="asset" />
</template>
