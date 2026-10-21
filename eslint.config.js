import js from '@eslint/js';
import globals from 'globals';

const dawnScripts = [
  'assets/animations.js',
  'assets/cart-disclosure-modal.js',
  'assets/cart-disclosure-tooltip.js',
  'assets/cart-drawer.js',
  'assets/cart-notification.js',
  'assets/cart.js',
  'assets/constants.js',
  'assets/customer.js',
  'assets/details-disclosure.js',
  'assets/details-modal.js',
  'assets/disclosures.js',
  'assets/facets.js',
  'assets/global.js',
  'assets/localization-form.js',
  'assets/magnify.js',
  'assets/main-search.js',
  'assets/media-gallery.js',
  'assets/password-modal.js',
  'assets/pickup-availability.js',
  'assets/predictive-search.js',
  'assets/price-per-item.js',
  'assets/product-form.js',
  'assets/product-info.js',
  'assets/product-modal.js',
  'assets/product-model.js',
  'assets/pubsub.js',
  'assets/quantity-popover.js',
  'assets/quick-add-bulk.js',
  'assets/quick-add.js',
  'assets/quick-order-list.js',
  'assets/recipient-form.js',
  'assets/search-form.js',
  'assets/share.js',
  'assets/show-more.js',
  'assets/standard-actions-override.js',
  'assets/theme-editor.js',
];

export default [
  {
    ignores: ['node_modules/', 'perf/results/', 'agents-doc/', 'assets/jquery-3.7.1.min.js'],
  },
  js.configs.recommended,
  {
    files: ['assets/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'script',
      globals: {
        ...globals.browser,
        Shopify: 'readonly',
      },
    },
  },
  {
    files: dawnScripts,
    linterOptions: {
      reportUnusedDisableDirectives: 'off',
    },
    rules: {
      'no-undef': 'off',
      'no-unused-vars': 'off',
      'no-redeclare': 'off',
      'no-self-assign': 'off',
      'no-useless-assignment': 'off',
    },
  },
  {
    files: ['perf/**/*.{js,mjs}', 'scripts/**/*.{js,mjs}', '*.config.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.node,
    },
  },
];
