module.exports = {
  extends: [require.resolve('@umijs/fabric/dist/eslint')],
  globals: {
    BASE_URL: true,
    BASE_PREFIX: true,
    NEED_DRAG: true,
    SYSTEM_NAME: true,
    REQUEST_EXPIRED_CODE: true,
    REQUEST_SUCCESS_CODE: true,
    TOKEN_FIELD: true,
  },
  rules: {
    'no-void': 0,
    'react/jsx-curly-newline': 0,
    'prefer-object-spread': 0,
    quotes: ['error', 'single', { allowTemplateLiterals: true }],
    '@typescript-eslint/quotes': ['error', 'single', { allowTemplateLiterals: true }],
    'no-console': ['error', { allow: ['warn', 'error'] }],
  },
};
