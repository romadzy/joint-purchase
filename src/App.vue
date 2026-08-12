<script setup lang="ts">
import { onMounted, watch } from 'vue';
import { RouterView } from 'vue-router';
import { useTheme } from './composables/useTheme';
import { useAuthStore } from './stores/auth';
import { useProductsStore } from './stores/products';
import { useUserStore } from './stores/user';
import { Toast, ConfirmDialog } from 'primevue';
import AppButton from './components/UI/AppButton.vue';

const authStore = useAuthStore();
const productsStore = useProductsStore();
const userStore = useUserStore();

useTheme();

onMounted(async () => {
    await authStore.initAuth();
    await productsStore.fetchData();

    if (authStore.user) {
        userStore.loadProfile();
        await userStore.fetchOrders();
    }
});

watch(() => authStore.user, (newUser) => {
    if (newUser) {
        userStore.loadProfile();
        userStore.fetchOrders();
    } else {
        userStore.myOrders = [];
    }
});
</script>

<template>
    <div class="min-h-screen w-full bg-main text-text-base font-sans antialiased transition-colors duration-200">
        <RouterView />
        <Toast />
        <ConfirmDialog>
            <template #container="{ message, acceptCallback, rejectCallback }">
                <div class="p-6 flex flex-col gap-4 bg-main rounded-xl border border-border-light shadow-xl max-w-sm w-full">
                    <div class="flex items-center gap-3 text-text-heading font-semibold text-lg">
                        <i :class="message.icon" class="text-2xl text-red-500"></i>
                        <span>{{ message.header }}</span>
                    </div>

                    <p class="text-text-base m-0">{{ message.message }}</p>

                    <div class="flex justify-end gap-3 mt-4">
                        <AppButton 
                            label="Keep Order" 
                            severity="secondary" 
                            variant="text" 
                            @click="rejectCallback" 
                        />
                        <AppButton 
                            label="Yes, Cancel" 
                            severity="danger" 
                            @click="acceptCallback" 
                        />
                    </div>
                </div>
            </template>
        </ConfirmDialog>
    </div>
</template>
