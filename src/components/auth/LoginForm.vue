<script setup lang="ts">
import { reactive } from 'vue';
import AppButton from '../UI/AppButton.vue';
import AppInput from '../UI/AppInput.vue';
import AppPassword from '../UI/AppPassword.vue';
import { useAuthStore } from '../../stores/auth';

const authStore = useAuthStore();

const formData = reactive({
    email: '',
    password: ''
});

const errors = reactive({
    email: '',
    password: ''
});

const validate = () => {
    let isValid = true;
    errors.email = '';
    errors.password = '';

    if (!formData.email) {
        errors.email = 'Email is required';
        isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.email = 'Invalid email format';
        isValid = false;
    }

    if (!formData.password) {
        errors.password = 'Password is required';
        isValid = false;
    }

    return isValid;
};

const onSubmit = async () => {
    if (!validate()) return;
    await authStore.login(formData.email, formData.password);
};
</script>

<template>
    <form @submit.prevent="onSubmit" class="space-y-4 mt-2">
        <div v-if="authStore.error" class="p-3 bg-red-100 text-red-700 rounded-md text-sm">
            {{ authStore.error }}
        </div>

        <AppInput
            id="login-email"
            label="Email"
            v-model="formData.email"
            type="email"
            :error="errors.email"
            placeholder="john@example.com"
        />
        
        <div class="flex flex-col gap-1.5">
            <AppPassword
                id="login-password"
                label="Password"
                v-model="formData.password"
                :error="errors.password"
            />
        </div>

        <AppButton 
            type="submit" 
            class="w-full mt-4" 
            :loading="authStore.isLoading"
        >
            Login
        </AppButton>
    </form>
</template>
