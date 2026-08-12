<script setup lang="ts">
import { useRouter } from 'vue-router';
import { Card } from 'primevue';
import { useProductsStore } from '../stores/products';

const router = useRouter();
const productsStore = useProductsStore();
</script>

<template>
    <div>
        <h1 class="text-3xl font-bold text-surface-900 mb-6">Choose a Category</h1>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <Card 
                v-for="category in productsStore.categories" 
                :key="category.id"
                class="cursor-pointer hover:shadow-xl transition-shadow overflow-hidden border border-border-light shadow-sm"
                @click="router.push(`/category/${category.id}`)"
            >
                <template #header>
                    <img :src="category.image" class="w-full h-48 object-cover" :alt="category.name" />
                </template>
                <template #title>
                    <div class="text-center">{{ category.name }}</div>
                </template>
            </Card>
        </div>
    </div>
</template>