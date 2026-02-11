// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", // ensure tailwind scans all source files
  ],
  theme: {
    extend: {
      colors: {
        theme: {
          deep: "#0B1220",
          deep2: "#071126",
          accent: "#00D1B2",
          accentSoft: "#8BE9FF",
          highlight: "#2DD4BF",
        }
      },
    },
  },
};
