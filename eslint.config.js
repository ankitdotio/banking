import js from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintConfigPrettier,

  {
    files: ["src/**/*.ts"],

    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },

    rules: {
      "no-console": [
  "warn",
  {
    allow: ["warn", "error"],
  },
],
      
    },
  },

  {
    ignores: [
      "dist",
      "node_modules",
      "*.config.js",
    ],
  },
);