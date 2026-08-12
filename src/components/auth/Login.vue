<script setup lang="ts">
import { ref } from 'vue';
import { Card } from 'primevue';
import { InputText, InputPassword, Label, Button } from 'primevue';

const email = ref<string>('');
const password = ref<string>('');
</script>

<template>
    <div class="flex justify-center">
        <Card class="max-w-sm w-full">
            <template #title>Welcome back</template>
            <template #subtitle>Sign in with your email to continue.</template>
            <template #content>
                <form class="space-y-6 mt-3">
                    <div class="flex flex-col gap-2">
                        <Label for="email">Email</Label>
                        <InputText id="email" v-model="email" type="email" />
                    </div>
                    <div class="flex flex-col gap-2">
                        <div class="flex items-center justify-between">
                            <Label for="password" class="flex-1">Password</Label>
                            <Button variant="link" class="p-0">Forgot password?</Button>
                        </div>
                        <InputPassword id="password" v-model="password" type="password" />
                    </div>
                </form>
            </template>
            <template #footer>
                <div class="flex flex-col gap-4">
                    <Button class="w-full">Login</Button>
                </div>
            </template>
        </Card>
    </div>
</template>