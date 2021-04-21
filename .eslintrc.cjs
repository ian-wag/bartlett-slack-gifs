module.exports = {
  root: true,
  env: {
    node: true,
    es2021: true,
  },
  extends: ['eslint:recommended', 'prettier'],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  rules: {
    // eslint - styles
    'linebreak-style': ['error', 'unix'],

    // eslint - es6
    'no-var': 'error',
    'no-duplicate-imports': 'error',
    'prefer-const': 'error',
  },
}
