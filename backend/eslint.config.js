const globals = require('globals');

module.exports = [
  {
    ignores: [
      'node_modules/**',
      'uploads/**',
      '.vercel/**',
      '.env'
    ]
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'script',
      globals: {
        ...globals.node,
        ...globals.jest
      }
    },
    rules: {
      'quotes': ['error', 'single', { allowTemplateLiterals: true }],
      'semi': ['error', 'always'],
      'no-console': 'off'
    }
  }
];
