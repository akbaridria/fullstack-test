<script lang="ts">
import { useColorMode } from '@vueuse/core';

useColorMode({
    initialValue: "dark"
})

</script>
<template>
    <slot />
</template>