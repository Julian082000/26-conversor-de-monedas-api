import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = [
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      complexity: ["warn", 12],
      "max-depth": ["warn", 3],
      "max-lines-per-function": ["warn", { max: 80, skipBlankLines: true, skipComments: true }],
    },
  },
];

export default eslintConfig;