// @ts-check
import eslint from '@eslint/js';
import eslintReact from "@eslint-react/eslint-plugin";
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig(
  eslint.configs.recommended,
  eslintReact.configs.recommended,
  tseslint.configs.recommended,
  {
    ignores: ['**/*.js'],
  },
  {
    files: ['**/*.ts'],
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
    },
  }
);