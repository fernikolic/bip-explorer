import baseConfig from "./tailwind.config.js";

export default {
  ...baseConfig,
  content: ["./client/src/**/*.{js,jsx,ts,tsx}", "./client/index.html"],
};