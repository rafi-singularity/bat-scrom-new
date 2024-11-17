/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    container: {
      // padding: "100px",
      screens: {
        md: "1080px",
        // => @media (min-width: 1280px) { ... }

        lg: "1336px",
        // => @media (min-width: 1536px) { ... }

        xl: "1720px",
        // => @media (min-width: 1745px) { ... }
      },
    },
    extend: {
      colors: {
        primary: "#14A2DF",
        yellow: "#FFBB00",
        blue: "#0E2B63",
        secondary: "#32BDF8",
      },
      screens: {
        "xl-zoom": "1600px", // Approximate effective viewport at 125% zoom on 1920px
        "lg-zoom": "1336px", // Approximate effective viewport at 125% zoom on 1440px
      },
    },
  },
  plugins: [],
};
