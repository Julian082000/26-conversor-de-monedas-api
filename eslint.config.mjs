import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const compat = new FlatCompat({ baseDirectory: __dirname });

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "complexity": ["error", 10],
      "max-lines-per-function": ["error", 50],
      "max-depth": ["error", 3],
      "no-console": "error",
      "eqeqeq": "error"
    }
  }
];

export default eslintConfig;
