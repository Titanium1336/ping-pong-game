/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'game-bg': '#0f0f23',
                'game-surface': '#1f2937',
            },
            fontFamily: {
                'game': ['Inter', 'system-ui', 'sans-serif'],
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'bounce-slow': 'bounce 2s infinite',
            },
            boxShadow: {
                'game': '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                'glow': '0 0 20px rgba(139, 92, 246, 0.3)',
            }
        },
    },
    plugins: [],
}