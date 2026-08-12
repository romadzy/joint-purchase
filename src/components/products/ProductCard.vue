<script setup lang="ts">
import { ref, computed } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useProductsStore } from '../../stores/products';
import { useUserStore } from '../../stores/user';
import { Card, ProgressBar } from 'primevue';
import AppButton from '../UI/AppButton.vue';
import type { Product } from '../../stores/products';

const props = defineProps<{
    product: Product
}>();

const productsStore = useProductsStore();
const userStore = useUserStore();
const toast = useToast();

const isBuying = ref(false);

const isOrdered = computed(() => userStore.myOrders.includes(props.product.id));

const progressPercent = computed(() => {
    const percent = (props.product.currentAmount / props.product.targetAmount) * 100;
    return Math.min(Math.round(percent), 100);
});

const isGoalReached = computed(() => progressPercent.value >= 100);

const handleBuy = async () => {
    if (isOrdered.value) return;
    isBuying.value = true;

    try {
        await productsStore.buyProduct(props.product.id);
        await userStore.addOrder(props.product.id);

        toast.add({ 
            severity: 'success', 
            summary: 'Success!', 
            detail: `You joined the group buy for ${props.product.title}`, 
            life: 3000
        });
        
    } catch (error) {
        toast.add({ 
            severity: 'error', 
            summary: 'Error', 
            detail: 'Something went wrong. Try again.', 
            life: 3000 
        });
    } finally {
        isBuying.value = false;
    }
};
</script>

<template>
    <Card class="flex flex-col h-full overflow-hidden hover:shadow-md transition-shadow border border-border-light shadow-sm">
        <template #header>
            <img :src="product.image" class="w-full h-48 object-cover" :alt="product.title" />
        </template>
        
        <template #title>
            <div class="text-lg font-semibold text-surface-900 truncate" :title="product.title">
                {{ product.title }}
            </div>
        </template>
        
        <template #subtitle>
            <div class="text-xl font-bold text-primary-600">${{ product.price }}</div>
        </template>

        <template #content>
            <div class="flex-1 flex flex-col">
                <p class="text-surface-600 text-sm line-clamp-3 min-h-[3.75rem] mb-4">
                    {{ product.description }}
                </p>

                <div class="mt-auto bg-surface-50 p-3 rounded-lg border border-surface-100">
                    <div class="flex justify-between text-xs mb-1">
                        <span class="font-medium text-surface-700">Group Goal</span>
                        <span :class="isGoalReached ? 'text-green-600 font-bold' : 'text-surface-500'">
                            {{ product.currentAmount }} / {{ product.targetAmount }}
                        </span>
                    </div>
                    <ProgressBar 
                        :value="progressPercent" 
                        :showValue="false" 
                        style="height: 6px"
                        :class="isGoalReached ? '[&>.p-progressbar-value]:bg-green-500' : ''"
                    />
                    <div class="text-xs text-surface-500 mt-2 text-center">
                        <span v-if="isGoalReached">Free delivery unlocked!</span>
                        <span v-else>Need {{ product.targetAmount - product.currentAmount }} more for free delivery</span>
                    </div>
                </div>
            </div>
        </template>

        <template #footer>
            <AppButton
                icon="pi pi-cart-plus" 
                :label="isOrdered ? 'Already Ordered' : (isGoalReached ? 'Buy Now' : 'Join & Buy')" 
                class="w-full"
                :severity="isOrdered ? 'secondary' : (isGoalReached ? 'success' : 'primary')"
                :loading="isBuying"
                :disabled="isOrdered"
                @click="handleBuy"
            />
        </template>
    </Card>
</template>

<style scoped>
:deep(.p-card-body) {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
}
:deep(.p-card-content) {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
}
</style>
