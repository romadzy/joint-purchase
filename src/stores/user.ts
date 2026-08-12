import { defineStore } from 'pinia';
import { ref } from 'vue';
import { supabase } from '../utils/supabase';
import { useProductsStore } from './products';
import { useAuthStore } from './auth';

export interface UserProfile {
    firstName: string;
    lastName: string;
    phone: string;
}

export const useUserStore = defineStore('user', () => {
    const profile = ref<UserProfile>({
        firstName: '',
        lastName: '',
        phone: ''
    });

    const myOrders = ref<number[]>([]);

    const loadProfile = () => {
        const authStore = useAuthStore();
        if (!authStore.user) return;
        const meta = authStore.user.user_metadata ?? {};
        profile.value = {
            firstName: meta.first_name ?? meta.full_name ?? '',
            lastName: meta.last_name ?? '',
            phone: meta.phone ?? ''
        };
    };

    const fetchOrders = async () => {
        const authStore = useAuthStore();
        if (!authStore.user) return;

        const { data } = await supabase
            .from('orders')
            .select('product_id')
            .eq('user_id', authStore.user.id);

        if (data) {
            myOrders.value = data.map(order => order.product_id);
        }
    };

    const updateProfile = async (data: UserProfile) => {
        const { error } = await supabase.auth.updateUser({
            data: {
                first_name: data.firstName,
                last_name: data.lastName,
                phone: data.phone
            }
        });
        if (error) throw error;
        profile.value = { ...data };
    };

    const addOrder = async (productId: number) => {
        const authStore = useAuthStore();
        if (!authStore.user) return;

        const { error } = await supabase
            .from('orders')
            .insert({ user_id: authStore.user.id, product_id: productId });

        if (error) throw error;
        if (!myOrders.value.includes(productId)) {
            myOrders.value.push(productId);
        }
    };

    const cancelOrder = async (productId: number) => {
        const authStore = useAuthStore();
        if (!authStore.user) return;

        const { error: deleteError } = await supabase
            .from('orders')
            .delete()
            .match({ user_id: authStore.user.id, product_id: productId });

        if (deleteError) throw deleteError;

        const productsStore = useProductsStore();
        const product = productsStore.products.find(p => p.id === productId);

        if (product) {
            const newAmount = product.currentAmount - product.price;
            const { error: updateError } = await supabase
                .from('products')
                .update({ current_amount: newAmount })
                .eq('id', productId);

            if (updateError) {
                await supabase
                    .from('orders')
                    .insert({ user_id: authStore.user!.id, product_id: productId });
                throw updateError;
            }

            product.currentAmount = newAmount;
        }

        myOrders.value = myOrders.value.filter(id => id !== productId);
    };

    return { profile, myOrders, loadProfile, fetchOrders, updateProfile, addOrder, cancelOrder };
});
