// Ignored via go/ees005
// eslint-disable-next-line import/no-commonjs
const eslint = require('eslint');

// Ignored via go/ees005
// eslint-disable-next-line import/no-commonjs
module.exports = new eslint.Linter().getRules().get('no-restricted-imports');
