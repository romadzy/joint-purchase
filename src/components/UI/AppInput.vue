<script setup lang="ts">
import { InputText } from 'primevue';

defineProps<{
    id: string;
    label: string;
    modelValue: string;
    type?: string;
    error?: string;
    placeholder?: string;
}>();

defineEmits<{
    (e: 'update:modelValue', value: string | undefined): void;
}>();
</script>

<template>
    <div class="flex flex-col gap-1.5">
        <label :for="id" class="text-sm font-medium text-surface-700">{{ label }}</label>
        <InputText
            :id="id"
            :type="type || 'text'"
            :model-value="modelValue"
            @update:model-value="$emit('update:modelValue', $event)"
            :class="{ 'p-invalid': error }"
            :placeholder="placeholder"
            class="w-full"
        />
        <small v-if="error" class="text-red-500">{{ error }}</small>
    </div>
</template>
