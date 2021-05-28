"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _base = require("@atlaskit/icon/base");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const CameraTakePictureIcon = props => /*#__PURE__*/_react.default.createElement(_base.Icon, Object.assign({
  dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><g fill="currentColor" fill-rule="evenodd"><circle cx="12" cy="12" r="5"/><path d="M12 18a6 6 0 100-12 6 6 0 000 12zm0 1a7 7 0 110-14 7 7 0 010 14z" fill-rule="nonzero"/></g></svg>`
}, props));

CameraTakePictureIcon.displayName = 'CameraTakePictureIcon';
var _default = CameraTakePictureIcon;
exports.default = _default;