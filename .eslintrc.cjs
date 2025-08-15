module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  parser: require.resolve("@typescript-eslint/parser"),
  parserOptions: {
    warnOnUnsupportedTypeScriptVersion: true,
    sourceType: "module",
    jsx: true,
    project: "./tsconfig.app.json",
    ecmaVersion: "latest",
    jsxPragma: "React",
    createDefaultProgram: true,
  },
  ignorePatterns: ["dist", ".eslintrc.cjs", "vite.config.ts", "*.cjs"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
    "plugin:import/typescript",
  ],
  settings: {
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true,
      },
      node: true,
    },
  },
  plugins: ["react-refresh", "import"],
  rules: {
    "no-control-regex": 0,
    "import/no-cycle": [
      "error",
      {
        maxDepth: Infinity,
      },
    ],
    "import/order": [
      "warn",
      {
        groups: [
          "builtin",
          "external",
          "internal",
          "parent",
          "sibling",
          "index",
        ],
        "newlines-between": "always",
      },
    ],
    "sort-imports": [
      "error",
      {
        ignoreCase: true,
        ignoreDeclarationSort: true,
      },
    ],
    "import/order": [
      "error",
      {
        groups: [
          ["external", "builtin"],
          "internal",
          ["sibling", "parent"],
          "index",
        ],
        pathGroups: [
          {
            pattern: "@(react|react-dom)",
            group: "external",
            position: "before",
          },
          {
            pattern: "@src/**",
            group: "internal",
          },
        ],
        pathGroupsExcludedImportTypes: ["internal", "react"],
        "newlines-between": "always",
        alphabetize: {
          order: "asc",
          caseInsensitive: true,
        },
      },
    ],
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
  },
};
