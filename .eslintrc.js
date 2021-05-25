module.exports = {
  env: {
    node: true,
    commonjs: true,
    jest: true,
  },
  extends: ["prettier"],
  plugins: ["prettier"],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    indent: ["error", 2],
    "linebreak-style": ["error", "windows"],
    semi: ["warn", "always"],
    eqeqeq: "error",
    "no-trailing-spaces": "error",
    "no-unused-vars": "warn",
    "object-curly-spacing": ["error", "always"],
    "arrow-spacing": ["error", { before: true, after: true }],
  },
};
