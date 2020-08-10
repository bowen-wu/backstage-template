const fabric = require('@umijs/fabric');

module.exports = {
  ...fabric.stylelint,
  rules: {
    'order/order': null,
    'order/properties-order': null,
    'declaration-empty-line-before': null,
    'no-descending-specificity': null,
    'no-duplicate-selectors': null,
  },
};
