<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Button } from 'primevue';
import AppButton from '../components/UI/AppButton.vue';
import { useProductsStore } from '../stores/products';
import ProductCard from '../components/products/ProductCard.vue';

const route = useRoute();
const router = useRouter();
const productsStore = useProductsStore();

const categoryId = Number(route.params.id);
const category = computed(() => productsStore.getCategoryById(categoryId));
const products = computed(() => productsStore.getProductsByCategory(categoryId));
</script>

<template>
    <div>
        <AppButton 
            icon="pi pi-arrow-left" 
            label="Back to Categories" 
            text
            severity="secondary"
            class="mb-2 -ml-3"
            @click="router.push('/')"
        />

        <div v-if="category" class="mb-6 flex items-center gap-4">
            <h1 class="text-3xl font-bold text-surface-900">{{ category.name }}</h1>
            <span class="bg-primary-100 text-primary-800 text-sm font-medium px-3 py-1 rounded-full">
                {{ products.length }} items
            </span>
        </div>
        <div v-else class="text-red-500 mb-8">Category not found</div>

        <div v-if="products.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <ProductCard 
                v-for="product in products" 
                :key="product.id" 
                :product="product" 
            />
        </div>

        <div v-else class="text-center py-12 rounded-xl border border-surface-200">
            <i class="pi pi-inbox text-4xl text-surface-400 mb-3"></i>
            <h2 class="text-xl text-surface-600">No products found in this category.</h2>
        </div>
    </div>
</template>
