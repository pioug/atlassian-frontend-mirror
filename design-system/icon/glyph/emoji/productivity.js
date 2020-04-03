"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var EmojiProductivityIcon = function EmojiProductivityIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" focusable=\"false\" role=\"presentation\"><g fill=\"currentColor\"><path d=\"M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12zm0 2a8 8 0 1 1 0-16 8 8 0 0 1 0 16z\"/><path d=\"M14.301 9.485a1 1 0 0 1 1.398 1.43l-4.261 4.166a1 1 0 0 1-1.406-.008l-2.04-2.04a1 1 0 1 1 1.415-1.413l1.34 1.34L14.3 9.484z\"/></g></svg>"
  }, props));
};

EmojiProductivityIcon.displayName = 'EmojiProductivityIcon';
var _default = EmojiProductivityIcon;
exports.default = _default;