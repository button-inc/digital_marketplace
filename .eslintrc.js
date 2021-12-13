module.exports = {
  "env": {
    "browser": true,
    "es2021": true,
    "node": true,

  },
  "globals": {
    "gruntConfig": "readonly"
  },
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:mocha/recommended"
    // "prettier",
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true,
    },
      "ecmaVersion": 13,
      "sourceType": "module",
    },
    "plugins": ["react", "@typescript-eslint", "mocha"],
    "rules": {
        // TODO remove rule overrides that affect code quality
      "@typescript-eslint/no-explicit-any": "off",
      "react/prop-types": "off",
      "@typescript-eslint/no-var-requires": "off",
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/ban-types": "off",
      "react/no-children-prop": "off",
  },
  overrides: [
    {
      // enable the rule specifically for TypeScript files
      "files": ["*.ts", "*.tsx"],
      "rules": {
        "@typescript-eslint/no-var-requires": "error"
      }
    }
  ]
};
