const colors = require('tailwindcss/colors')

module.exports = {
  mode: 'jit',
  purge: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './types/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: colors.blue,
        onPrimary: colors.blue['50'],
        background: colors.gray['200'],
        surface: 'white',
      },
      gridTemplateColumns: {
        '300-2': 'repeat(2, 300px)',
        '300-3': 'repeat(3, 300px)',
        '300-4': 'repeat(4, 300px)',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
}
