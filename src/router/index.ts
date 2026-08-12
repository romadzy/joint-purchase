import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

import AuthView from '../views/AuthView.vue';
import DefaultLayout from '../components/layout/DefaultLayout.vue';
import CategoriesView from '../views/CategoriesView.vue';
import CategoryDetailView from '../views/CategoryDetailView.vue';
import ProfileView from '../views/ProfileView.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/auth',
            name: 'Auth',
            component: AuthView,
            meta: { guestOnly: true }
        },
        {
            path: '/',
            component: DefaultLayout,
            meta: { requiresAuth: true },
            children: [
                {
                    path: '',
                    name: 'Categories',
                    component: CategoriesView
                },
                {
                    path: 'category/:id',
                    name: 'CategoryDetail',
                    component: CategoryDetailView
                },
                {
                    path: 'profile',
                    name: 'Profile',
                    component: ProfileView
                }
            ]
        }
    ]
});

router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore();
    await authStore.initAuth();
    const isAuthenticated = !!authStore.user;

    if (to.meta.requiresAuth && !isAuthenticated) {
        next('/auth');
    } else if (to.meta.guestOnly && isAuthenticated) {
        next('/');
    } else {
        next();
    }
});

export default router;
