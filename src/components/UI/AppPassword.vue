<script setup lang="ts">
import { Password } from 'primevue';

defineProps<{
    id: string;
    label: string;
    modelValue: string;
    error?: string;
    feedback?: boolean;
}>();

defineEmits<{
    (e: 'update:modelValue', value: string): void;
}>();
</script>

<template>
    <div class="flex flex-col gap-1.5">
        <label :for="id" class="text-sm font-medium text-surface-700">{{ label }}</label>
        <Password
            :id="id"
            :model-value="modelValue"
            @update:model-value="$emit('update:modelValue', $event)"
            :class="{ 'p-invalid': error }"
            :feedback="feedback ?? false"
            toggleMask
            inputClass="w-full"
            class="w-full [&>input]:w-full"
        />
        <small v-if="error" class="text-red-500">{{ error }}</small>
    </div>
</template>
