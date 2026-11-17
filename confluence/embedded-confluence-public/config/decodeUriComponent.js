// query-string 7 requires a callable CommonJS export; the patched decoder exports an ESM default.
module.exports = require('decode-uri-component-patched').default;
