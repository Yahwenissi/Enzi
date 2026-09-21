/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ["class"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Fredoka", "Baloo 2", "sans-serif"],
        body: ["Nunito", "sans-serif"],
      },
      colors: {
        clay: "#FFF5E8",
        charcoal: "#30231E",
        orange: "#D96142",
        darkorange: "#A9432D",
        green: "#78B84A",
        purple: "#8250B4",
        cyan: "#55B9C8",
        pink: "#D95E86",
        gold: "#DDAA45",
        subtle: "#F0EFEB",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        btn: "9999px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}