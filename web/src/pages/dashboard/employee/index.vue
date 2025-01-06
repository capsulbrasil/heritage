<script setup lang="ts">

definePage({
    meta: {
        title: 'Employee',
        icon: 'folder-user',
    },
})
</script>

<template>
  <aeria-crud collection="employee" />
</template>
