// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  darkMode: 'class', // <-- important: enable class-based dark mode
  theme: {
    extend: {},
  },
  plugins: [],
}
