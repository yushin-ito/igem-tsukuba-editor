import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import tseslint, { configs } from "typescript-eslint";
import tailwindcss from "eslint-plugin-tailwindcss";
import importPlugin from "eslint-plugin-import";
import unusedImports from "eslint-plugin-unused-imports";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default tseslint.config({
  extends: [
    ...compat.extends(
      "next/core-web-vitals",
      "next/typescript",
      "plugin:tailwindcss/recommended",
      "plugin:import/recommended",
      "plugin:import/typescript"
    ),
    ...configs.strict,
    ...configs.stylistic,
  ],
  plugins: {
    tailwindcss,
    import: importPlugin,
    "unused-imports": unusedImports,
  },
  rules: {
    "react/display-name": "off",
    "next/no-img-element": "off",
    "tailwindcss/no-custom-classname": "off",
    "unused-imports/no-unused-imports": "error",
    "unused-imports/no-unused-vars": "warn",
    "import/order": [
      "error",
      {
        groups: [
          ["builtin", "external"],
          ["internal", "parent", "sibling", "index"],
        ],
        "newlines-between": "always",
      },
    ],
    "import/no-unresolved": "error",
    "import/no-duplicates": "error",
  },
});
