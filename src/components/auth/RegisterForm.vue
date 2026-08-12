<script setup lang="ts">
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import AppButton from '../UI/AppButton.vue';
import AppInput from '../UI/AppInput.vue';
import AppPassword from '../UI/AppPassword.vue';
import { useAuthStore } from '../../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const formData = reactive({
    name: '',
    email: '',
    password: '',
    passwordConfirm: ''
});

const errors = reactive({
    name: '',
    email: '',
    password: '',
    passwordConfirm: ''
});

const validate = () => {
    let isValid = true;
    Object.keys(errors).forEach(k => errors[k as keyof typeof errors] = '');

    if (!formData.name) {
        errors.name = 'Name is required';
        isValid = false;
    }

    if (!formData.email) {
        errors.email = 'Email is required';
        isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.email = 'Invalid email format';
        isValid = false;
    }

    if (formData.password.length < 6) {
        errors.password = 'Password must be at least 6 characters';
        isValid = false;
    }

    if (formData.password !== formData.passwordConfirm) {
        errors.passwordConfirm = 'Passwords do not match';
        isValid = false;
    }

    return isValid;
};

const onSubmit = async () => {
    if (!validate()) return;
    await authStore.register(formData.email, formData.password, formData.name);
    if (!authStore.error) {
        router.push('/');
    }
};
</script>

<template>
    <form @submit.prevent="onSubmit" class="space-y-4 mt-2">
        <div v-if="authStore.error" class="p-3 bg-red-100 text-red-700 rounded-md text-sm">
            {{ authStore.error }}
        </div>

        <AppInput
            id="reg-name"
            label="Full Name"
            v-model="formData.name"
            :error="errors.name"
            placeholder="John Doe"
        />

        <AppInput
            id="reg-email"
            label="Email"
            v-model="formData.email"
            type="email"
            :error="errors.email"
        />

        <AppPassword
            id="reg-password"
            label="Password"
            v-model="formData.password"
            :error="errors.password"
            feedback
        />

        <AppPassword
            id="reg-password-confirm"
            label="Confirm Password"
            v-model="formData.passwordConfirm"
            :error="errors.passwordConfirm"
        />

        <AppButton 
            type="submit" 
            class="w-full mt-4" 
            :loading="authStore.isLoading"
        >
            Create Account
        </AppButton>
    </form>
</template>