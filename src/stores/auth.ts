import { defineStore } from 'pinia';
import { ref } from 'vue';
import { supabase } from '../utils/supabase';
import type { User } from '@supabase/supabase-js';

export const useAuthStore = defineStore('auth', () => {
    const user = ref<User | null>(null);
    const isLoading = ref<boolean>(false);
    const error = ref<string | null>(null);

    let initPromise: Promise<void> | null = null;

    const login = async (email: string, password: string) => {
        isLoading.value = true;
        error.value = null;
        try {
            const { data, error: sbError } = await supabase.auth.signInWithPassword({
                email,
                password
            });
            if (sbError) throw sbError;
            user.value = data.user;
        } catch (e: unknown) {
            error.value = e instanceof Error ? e.message : 'Ошибка авторизации';
        } finally {
            isLoading.value = false;
        }
    };

    const register = async (email: string, password: string, name: string) => {
        isLoading.value = true;
        error.value = null;
        try {
            const { data, error: sbError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: { full_name: name }
                }
            });
            if (sbError) throw sbError;
            user.value = data.user;
        } catch (e: unknown) {
            error.value = e instanceof Error ? e.message : 'Ошибка регистрации';
        } finally {
            isLoading.value = false;
        }
    };

    const logout = async () => {
        await supabase.auth.signOut();
        user.value = null;
    };

    const initAuth = (): Promise<void> => {
        if (!initPromise) {
            initPromise = (async () => {
                const { data } = await supabase.auth.getSession();
                user.value = data.session?.user ?? null;

                supabase.auth.onAuthStateChange((_event, session) => {
                    user.value = session?.user ?? null;
                });
            })();
        }
        return initPromise;
    };

    return { user, isLoading, error, login, register, logout, initAuth };
});
