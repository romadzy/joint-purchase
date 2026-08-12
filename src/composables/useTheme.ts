import { ref, onMounted } from 'vue';

export function useTheme() {
    const isDark = ref(false);

    const initTheme = () => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            isDark.value = savedTheme === 'dark';
        } else {
            isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        applyTheme(isDark.value);
    };

    const applyTheme = (dark: boolean) => {
        const root = document.documentElement;
        if (dark) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    };

    const toggleTheme = () => {
        isDark.value = !isDark.value;
        localStorage.setItem('theme', isDark.value ? 'dark' : 'light');
        applyTheme(isDark.value);
    };

    onMounted(() => {
        initTheme();
    });

    return {
        isDark,
        toggleTheme
    };
}
