const warnSchemaChangeRule = require('./warn-schema-change');

const plugin = { rules: { 'warn-schema-change': warnSchemaChangeRule } };
module.exports = plugin;
