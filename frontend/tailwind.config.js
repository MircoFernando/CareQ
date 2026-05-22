/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1A8C7A', // Teal
          dark: '#156D5F',    // Dark Teal hover
          light: '#E6F4F2',   // Light Teal tint
        },
        surface: '#FFFFFF',
        bg: '#F4F6F8',
        text: {
          primary: '#1A1A2E',
          secondary: '#5A6472',
        },
        border: {
          DEFAULT: '#E2E8F0',
          focus: '#1A8C7A',
        },
        emergency: '#D9363E', // red priority 0
        urgent: '#E87A2F',    // orange priority 1
        normal: '#1A8C7A',    // teal priority 2
        sla: '#F0A500',       // amber SLA
        active: '#2ECC71',    // green
        inactive: '#95A5A6',  // grey
        deactivated: '#E74C3C', // red pill
        chart: {
          morning: '#1A8C7A',
          afternoon: '#2196F3',
          evening: '#9C27B0',
        }
      },
      fontFamily: {
        sans: ['DM Sans', 'Nunito Sans', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
