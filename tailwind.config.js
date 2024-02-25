/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        darkGreen: '#2E5504',
        green: '#5F8604', 
        lightGreen: '#CCE492',
        mutedGreen: '#8DBF58',
        red: '#D40707',
        orange: '#C85107',
        calmGray: '#F0F0F0'
      }
    },
  },
  plugins: [],
}

