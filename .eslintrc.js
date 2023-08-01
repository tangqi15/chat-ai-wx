module.exports = {
  globals: {
    uni: true,
    wx: true,
  },
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:vue/vue3-essential",
  ],
  overrides: [
    {
      env: {
        node: true,
      },
      files: [".eslintrc.{js,cjs}"],
      parserOptions: {
        sourceType: "script",
      },
    },
  ],
  parserOptions: {
    ecmaVersion: "latest",
    parser: "@typescript-eslint/parser",
    sourceType: "module",
    // ecmaVersion: 13,
    extraFileExtensions: ['.vue'],
  },
  plugins: ["@typescript-eslint", "vue"],
  rules: {
    'vue/multi-word-component-names': 0,
    'no-plusplus': 0,
    "@typescript-eslint/no-explicit-any": "off"
  },
};
