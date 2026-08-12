<script setup lang="ts">
import { Button } from 'primevue';
</script>

<template>
    <Button class="transition-transform duration-200 active:scale-[0.97]">
        <template v-for="(_, name) in $slots" #[name]="slotProps">
            <slot :name="name" v-bind="slotProps || {}" />
        </template>
    </Button>
</template>