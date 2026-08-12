import { defineStore } from 'pinia';
import { ref } from 'vue';
import { supabase } from '../utils/supabase';
import type { Product, Category } from '../types/product';

export type { Product, Category };

export const useProductsStore = defineStore('products', () => {
    const categories = ref<Category[]>([]);
    const products = ref<Product[]>([]);

    const fetchData = async () => {
        const [catsResponse, prodsResponse] = await Promise.all([
            supabase.from('categories').select('*'),
            supabase.from('products').select('*')
        ]);

        if (catsResponse.data) {
            categories.value = catsResponse.data;
        }

        if (prodsResponse.data) {
            products.value = prodsResponse.data.map(p => ({
                id: p.id,
                categoryId: p.category_id,
                title: p.title,
                description: p.description,
                price: p.price,
                image: p.image,
                targetAmount: p.target_amount,
                currentAmount: p.current_amount
            }));
        }
    };

    const getProductsByCategory = (categoryId: number) => {
        return products.value.filter(p => p.categoryId === categoryId);
    };

    const getCategoryById = (id: number) => {
        return categories.value.find(c => c.id === id);
    };

    const buyProduct = async (productId: number) => {
        const product = products.value.find(p => p.id === productId);
        if (!product) return;

        const newAmount = product.currentAmount + product.price;

        const { error } = await supabase
            .from('products')
            .update({ current_amount: newAmount })
            .eq('id', productId);

        if (!error) {
            product.currentAmount = newAmount;
        } else {
            throw error;
        }
    };

    return { 
        categories, 
        products, 
        fetchData, 
        getProductsByCategory, 
        getCategoryById, 
        buyProduct 
    };
});
