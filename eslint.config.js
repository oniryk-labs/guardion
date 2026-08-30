import js from "@eslint/js";
import tseslint from "typescript-eslint";

const paddedStatements = ["if", "for", "while", "do", "try", "switch"];

const paddingRules = [
  ...paddedStatements.flatMap((statement) => [
    { blankLine: "always", prev: "*", next: statement },
    { blankLine: "always", prev: statement, next: "*" },
  ]),
  // require blank lines between statements
  { blankLine: "always", prev: "*", next: "return" },
  { blankLine: "any", prev: "expression", next: "return" },
  { blankLine: "always", prev: "*", next: "throw" },
  { blankLine: "always", prev: "import", next: "*" },
  { blankLine: "any", prev: "import", next: "import" },
  { blankLine: "always", prev: "const", next: "*" },
  { blankLine: "any", prev: "const", next: "const" },
  { blankLine: "any", prev: "const", next: "expression" },
  { blankLine: "any", prev: "const", next: "return" },
  { blankLine: "always", prev: "let", next: "*" },
  { blankLine: "any", prev: "let", next: "let" },
  { blankLine: "always", prev: "if", next: "if" },
  { blankLine: "always", prev: "var", next: "*" },
  { blankLine: "any", prev: "var", next: "var" },
  { blankLine: "always", prev: "export", next: "*" },
  { blankLine: "any", prev: "export", next: "export" },
];

export default tseslint.config(
  {
    ignores: ["dist/", "node_modules/", "coverage/"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
    rules: {
      curly: ["error", "all"],
      "padding-line-between-statements": ["error", ...paddingRules],
      "@typescript-eslint/no-explicit-any": "off",
    },
  }
);