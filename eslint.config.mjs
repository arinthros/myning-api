import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

const config = [
  {
    ignores: [".next/**", ".yarn/**", "node_modules/**", "myning/**", "public/**"],
  },
  ...nextCoreWebVitals,
];

export default config;
