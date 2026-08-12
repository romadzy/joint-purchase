<script setup lang="ts">
import { Card, Tabs, TabList, Tab, TabPanels, TabPanel } from 'primevue';
import LoginForm from '../components/auth/LoginForm.vue';
import RegisterForm from '../components/auth/RegisterForm.vue';
</script>

<template>
    <div class="min-h-screen flex items-center justify-center bg-surface-50 p-4">
        <Card class="max-w-md w-full shadow-lg">
            <template #title>
                <div class="text-center text-2xl font-semibold">
                    Welcome
                </div>
            </template>
            <template #subtitle>
                <div class="text-center text-surface-500 mb-4">
                    Sign in to your account or register a new one.
                </div>
            </template>
            <template #content>
                <Tabs value="login">
                    <TabList class="flex justify-center w-full mb-4">
                        <Tab value="login" class="w-1/2 text-center">Login</Tab>
                        <Tab value="register" class="w-1/2 text-center">Register</Tab>
                    </TabList>
                    
                    <TabPanels>
                        <TabPanel value="login">
                            <LoginForm />
                        </TabPanel>
                        
                        <TabPanel value="register">
                            <RegisterForm />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </template>
        </Card>
    </div>
</template>
