"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _base = require("@atlaskit/icon/base");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const EmojiProductivityIcon = props => /*#__PURE__*/_react.default.createElement(_base.Icon, Object.assign({
  dangerouslySetGlyph: `<svg width="24" height="24" role="presentation"><g fill="currentColor"><path d="M12 18a6 6 0 100-12 6 6 0 000 12zm0 2a8 8 0 110-16 8 8 0 010 16z"/><path d="M14.301 9.485a1 1 0 011.398 1.43l-4.261 4.166a1 1 0 01-1.406-.008l-2.04-2.04a1 1 0 111.415-1.413l1.34 1.34L14.3 9.484z"/></g></svg>`
}, props));

EmojiProductivityIcon.displayName = 'EmojiProductivityIcon';
var _default = EmojiProductivityIcon;
exports.default = _default;