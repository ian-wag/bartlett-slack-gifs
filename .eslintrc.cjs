module.exports = {
  root: true,
  env: {
    node: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'prettier',
    'plugin:import/errors',
    'plugin:import/warnings',
  ],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  rules: {
    // eslint:recommended
    'no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
      },
    ],

    // eslint - styles
    'linebreak-style': ['error', 'unix'],

    // eslint - es6
    'no-var': 'error',
    'no-duplicate-imports': 'error',
    'prefer-const': 'error',

    // plugin:import
    'import/order': [
      'error',
      {
        alphabetize: { order: 'asc' },
        'newlines-between': 'always-and-inside-groups',
      },
    ],
    'import/no-unresolved': 'error',
    'import/no-cycle': 'error',
  },
}
