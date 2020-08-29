module.exports = {
  extends: [require.resolve('@umijs/fabric/dist/eslint')],
  globals: {
    BASEURL: true,
    BASEPREFIX: true,
    page: true,
    NEED_DRAG: true,
  },
  rules: {
    'no-void': 0,
    'react/jsx-curly-newline': 0,
    'prefer-object-spread': 0,
    quotes: ['error', 'single', { allowTemplateLiterals: true }],
    '@typescript-eslint/quotes': ['error', 'single', { allowTemplateLiterals: true }],
  },
};
