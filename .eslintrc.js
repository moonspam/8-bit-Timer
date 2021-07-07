module.exports = {
  extends: 'airbnb-base',
  plugins: [
    'import',
  ],
  env: {
    browser: ['last 2 versions', 'safari >= 7'],
    jquery: true,
  },
  rules: {
    'no-console': 0,
    'no-alert': 0,
    'no-var': 0,
  },
  globals: {
    $: false,
  },
};
