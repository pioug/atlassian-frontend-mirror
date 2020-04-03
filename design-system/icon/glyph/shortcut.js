"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var ShortcutIcon = function ShortcutIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><g fill=\"currentColor\"><path d=\"M19.005 19c-.003 0-.005.002-.005.002l.005-.002zM5 19.006c0-.004-.002-.006-.005-.006H5v.006zM5 4.994V5v-.006zM19 19v-6h2v6.002A1.996 1.996 0 0 1 19.005 21H4.995A1.996 1.996 0 0 1 3 19.006V4.994C3 3.893 3.896 3 4.997 3H11v2H5v14h14zM5 4.994V5v-.006zm0 14.012c0-.004-.002-.006-.005-.006H5v.006zM11 5H5v14h14v-6h2v6.002A1.996 1.996 0 0 1 19.005 21H4.995A1.996 1.996 0 0 1 3 19.006V4.994C3 3.893 3.896 3 4.997 3H11v2zm8 0v3a1 1 0 0 0 2 0V4a1 1 0 0 0-1-1h-4a1 1 0 0 0 0 2h3z\"/><path d=\"M12.707 12.707l8-8a1 1 0 1 0-1.414-1.414l-8 8a1 1 0 0 0 1.414 1.414z\"/></g></svg>"
  }, props));
};

ShortcutIcon.displayName = 'ShortcutIcon';
var _default = ShortcutIcon;
exports.default = _default;