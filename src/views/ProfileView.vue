<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { Tabs, TabList, Tab, TabPanels, TabPanel, Card, ProgressBar } from 'primevue';
import AppButton from '../components/UI/AppButton.vue';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import AppInput from '../components/UI/AppInput.vue';
import { useUserStore } from '../stores/user';
import { useProductsStore } from '../stores/products';
import type { Product } from '../types/product';

const userStore = useUserStore();
const productsStore = useProductsStore();
const confirm = useConfirm();
const toast = useToast();

const formData = ref({ ...userStore.profile });
const isSaving = ref(false);

onMounted(() => {
    userStore.loadProfile();
    formData.value = { ...userStore.profile };
});

const handleSaveProfile = async () => {
    isSaving.value = true;
    try {
        await userStore.updateProfile(formData.value);
        toast.add({ severity: 'success', summary: 'Saved', detail: 'Your profile has been updated.', life: 3000 });
    } catch {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to save profile.', life: 3000 });
    } finally {
        isSaving.value = false;
    }
};

const orders = computed((): Product[] => {
    return userStore.myOrders
        .map(id => productsStore.products.find(p => p.id === id))
        .filter((p): p is Product => p !== undefined);
});

const getProgress = (product: Product): number => {
    return Math.min(Math.round((product.currentAmount / product.targetAmount) * 100), 100);
};

const confirmCancelOrder = (product: Product) => {
    confirm.require({
        message: `Are you sure you want to cancel your order for "${product.title}"?`,
        header: 'Cancel Order Confirmation',
        icon: 'pi pi-exclamation-triangle',
        acceptClass: 'p-button-danger',
        accept: async () => {
            try {
                await userStore.cancelOrder(product.id);
                toast.add({ severity: 'info', summary: 'Cancelled', detail: 'Order successfully removed.', life: 3000 });
            } catch {
                toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to cancel order.', life: 3000 });
            }
        }
    });
};
</script>

<template>
    <div class="max-w-4xl mx-auto">
        <h1 class="text-3xl font-bold text-text-heading mb-6">My Account</h1>

        <Card class="border border-border-light shadow-sm">
            <template #content>
                <Tabs value="info">
                    <TabList class="mb-4">
                        <Tab value="info">Personal Info</Tab>
                        <Tab value="orders">
                            My Orders 
                            <span v-if="orders.length" class="bg-primary-100 text-primary-800 rounded-full px-2 py-0.5 text-xs">
                                {{ orders.length }}
                            </span>
                        </Tab>
                    </TabList>
                    
                    <TabPanels>
                        <TabPanel value="info">
                            <form @submit.prevent="handleSaveProfile" class="space-y-4 max-w-md mt-2">
                                <AppInput 
                                    id="firstName" 
                                    label="First Name" 
                                    v-model="formData.firstName" 
                                />
                                <AppInput 
                                    id="lastName" 
                                    label="Last Name" 
                                    v-model="formData.lastName" 
                                />
                                <AppInput 
                                    id="phone" 
                                    label="Phone Number" 
                                    v-model="formData.phone" 
                                    type="tel"
                                />
                                <AppButton 
                                    type="submit" 
                                    label="Save Changes" 
                                    icon="pi pi-check" 
                                    :loading="isSaving"
                                    class="mt-4"
                                />
                            </form>
                        </TabPanel>

                        <TabPanel value="orders">
                            <div v-if="orders.length === 0" class="text-center py-12">
                                <i class="pi pi-box text-4xl text-text-base opacity-50 mb-3"></i>
                                <h3 class="text-lg font-medium text-text-heading">No active orders</h3>
                                <p class="text-text-base mt-1">Join a group buy to see your orders here.</p>
                                <AppButton label="Browse Categories" text class="mt-4" @click="$router.push('/')" />
                            </div>

                            <div v-else class="flex flex-col gap-4 mt-2">
                                <div 
                                    v-for="product in orders" 
                                    :key="product?.id"
                                    class="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border border-border-light rounded-xl bg-code-bg"
                                >
                                    <div class="flex items-center gap-4 w-full sm:w-auto flex-1">
                                        <img :src="product?.image" class="w-16 h-16 object-cover rounded-md border border-border-light" alt="Product" />
                                        <div class="flex-1">
                                            <h4 class="font-medium text-text-heading">{{ product?.title }}</h4>
                                            <div class="text-sm text-text-base mb-1">
                                                Goal: {{ product?.currentAmount }} / {{ product?.targetAmount }}
                                            </div>
                                            <ProgressBar 
                                                :value="getProgress(product)" 
                                                :showValue="false" 
                                                style="height: 4px"
                                                :class="getProgress(product) >= 100 ? '[&>.p-progressbar-value]:bg-green-500' : ''"
                                            />
                                        </div>
                                    </div>

                                    <AppButton 
                                        icon="pi pi-times" 
                                        severity="danger" 
                                        text 
                                        rounded
                                        v-tooltip.top="'Cancel Order'"
                                        @click="confirmCancelOrder(product)"
                                    />
                                </div>
                            </div>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </template>
        </Card>
    </div>
</template>
