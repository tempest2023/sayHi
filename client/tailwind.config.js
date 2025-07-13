/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  // eslint-disable-next-line global-require
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#2A93D5',
        secondary: '#6677CC',
      },
    },
  },
  plugins: [],
}

