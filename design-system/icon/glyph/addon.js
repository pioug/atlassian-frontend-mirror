"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _base = require("@atlaskit/icon/base");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const AddonIcon = props => /*#__PURE__*/_react.default.createElement(_base.Icon, Object.assign({
  dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><g fill="currentColor" fill-rule="evenodd"><path d="M5.376 6.455l5.248-3.104c.792-.469 1.963-.467 2.752 0l5.248 3.104C19.416 6.923 20 7.962 20 8.895v6.21c0 .936-.587 1.973-1.376 2.44l-5.248 3.104c-.792.469-1.963.467-2.752 0l-5.248-3.104C4.584 17.077 4 16.038 4 15.105v-6.21c0-.936.587-1.973 1.376-2.44zm6.99-1.314c-.165-.098-.566-.098-.733 0L6.385 8.245c-.166.098-.367.454-.367.65v6.21c0 .195.2.551.367.65l5.248 3.104c.166.098.567.098.734 0l5.248-3.104c.166-.098.367-.454.367-.65v-6.21c0-.195-.2-.551-.367-.65l-5.248-3.104z"/><path d="M12 16a4 4 0 110-8 4 4 0 010 8zm0-2a2 2 0 100-4 2 2 0 000 4z"/></g></svg>`
}, props));

AddonIcon.displayName = 'AddonIcon';
var _default = AddonIcon;
exports.default = _default;