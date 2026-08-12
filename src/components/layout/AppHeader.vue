<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { Avatar, Menu, Badge, Popover } from 'primevue';
import AppButton from '../UI/AppButton.vue';
import { useToast } from 'primevue/usetoast';
import { useAuthStore } from '../../stores/auth';
import { useUserStore } from '../../stores/user';
import { useProductsStore } from '../../stores/products';
import type { Product } from '../../types/product';

const router = useRouter();
const authStore = useAuthStore();
const userStore = useUserStore();
const productsStore = useProductsStore();
const toast = useToast();

const menu = ref();
const cartPopover = ref();

const avatarLabel = computed(() => {
    const name = authStore.user?.user_metadata?.full_name || authStore.user?.email || '?';
    return name[0].toUpperCase();
});

const avatarSrc = computed(() => authStore.user?.user_metadata?.avatar_url || undefined);

const cartItems = computed((): Product[] =>
    userStore.myOrders
        .map(id => productsStore.products.find(p => p.id === id))
        .filter((p): p is Product => p !== undefined)
);

const cancellingId = ref<number | null>(null);

const cancelOrder = async (productId: number) => {
    cancellingId.value = productId;
    try {
        await userStore.cancelOrder(productId);
        toast.add({ severity: 'info', summary: 'Removed', detail: 'Order cancelled.', life: 3000 });
    } catch {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to cancel order.', life: 3000 });
    } finally {
        cancellingId.value = null;
    }
};

const menuItems = ref([
    {
        label: 'Profile',
        icon: 'pi pi-user',
        command: () => { router.push('/profile'); }
    },
    { separator: true },
    {
        label: 'Logout',
        icon: 'pi pi-sign-out',
        command: async () => {
            await authStore.logout();
            router.push('/auth');
        }
    }
]);

const toggleMenu = (event: Event) => menu.value.toggle(event);
const toggleCart = (event: Event) => cartPopover.value.toggle(event);
</script>

<template>
    <header class="border-b border-surface-200 sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div 
                class="text-xl font-bold text-primary-600 cursor-pointer flex items-center gap-2"
                @click="router.push('/')"
            >
                <i class="pi pi-users"></i>
                GroupBuy
            </div>

            <div class="flex items-center gap-4">
                <div class="relative">
                    <AppButton text rounded aria-label="Cart" @click="toggleCart">
                        <i class="pi pi-shopping-cart text-lg"></i>
                    </AppButton>
                    <Badge
                        v-if="userStore.myOrders.length"
                        :value="userStore.myOrders.length"
                        severity="danger"
                        class="absolute -top-1 -right-1 pointer-events-none"
                    />
                </div>

                <Popover ref="cartPopover">
                    <div class="w-80">
                        <div class="font-semibold text-surface-800 mb-3 px-1">
                            My Orders
                            <span class="text-surface-400 font-normal text-sm ml-1">({{ cartItems.length }})</span>
                        </div>

                        <div v-if="cartItems.length === 0" class="text-center py-6 text-surface-400 text-sm">
                            No active orders
                        </div>

                        <ul v-else class="flex flex-col gap-2 max-h-72 overflow-y-auto">
                            <li
                                v-for="item in cartItems"
                                :key="item.id"
                                class="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-50"
                            >
                                <img :src="item.image" :alt="item.title" class="w-10 h-10 rounded object-cover shrink-0 border border-surface-100" />
                                <div class="flex-1 min-w-0">
                                    <div class="text-sm font-medium text-surface-800 truncate">{{ item.title }}</div>
                                    <div class="text-xs text-surface-500">${{ item.price }}</div>
                                </div>
                                <AppButton
                                    icon="pi pi-times"
                                    text
                                    rounded
                                    severity="danger"
                                    size="small"
                                    :loading="cancellingId === item.id"
                                    v-tooltip.left="'Cancel order'"
                                    @click="cancelOrder(item.id)"
                                />
                            </li>
                        </ul>

                        <div v-if="cartItems.length" class="mt-3 pt-3 border-t border-surface-100">
                            <AppButton label="View All Orders" text size="small" class="w-full" @click="router.push('/profile')" />
                        </div>
                    </div>
                </Popover>

                <Avatar 
                    :image="avatarSrc"
                    :label="avatarSrc ? undefined : avatarLabel"
                    shape="circle" 
                    class="cursor-pointer border border-surface-200 hover:opacity-80 transition-opacity"
                    @click="toggleMenu" 
                />
                
                <Menu ref="menu" :model="menuItems" :popup="true" />
            </div>
        </div>
    </header>
</template>
