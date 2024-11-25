/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    container: {
      // padding: "100px",
      screens: {
        md: "980px",
        // => @media (min-width: 1280px) { ... }

        lg: "1236px",
        // => @media (min-width: 1536px) { ... }

        xl: "1620px",
        // => @media (min-width: 1745px) { ... }
      },
    },
    extend: {
      colors: {
        primary: "#0E2B63",
        yellow: "#FFBB00",
        blue: "#00B1EB",
        secondary: "#16397D",
      },
      screens: {
        "xl-zoom": "1600px", // Approximate effective viewport at 125% zoom on 1920px
        "lg-zoom": "1336px", // Approximate effective viewport at 125% zoom on 1440px
      },
    },
  },
  plugins: [],
};