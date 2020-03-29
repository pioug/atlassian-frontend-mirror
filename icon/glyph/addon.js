"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var AddonIcon = function AddonIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><g fill=\"currentColor\" fill-rule=\"evenodd\"><path d=\"M5.376 6.455l5.248-3.104c.792-.469 1.963-.467 2.752 0l5.248 3.104C19.416 6.923 20 7.962 20 8.895v6.21c0 .936-.587 1.973-1.376 2.44l-5.248 3.104c-.792.469-1.963.467-2.752 0l-5.248-3.104C4.584 17.077 4 16.038 4 15.105v-6.21c0-.936.587-1.973 1.376-2.44zm6.99-1.314c-.165-.098-.566-.098-.733 0L6.385 8.245c-.166.098-.367.454-.367.65v6.21c0 .195.2.551.367.65l5.248 3.104c.166.098.567.098.734 0l5.248-3.104c.166-.098.367-.454.367-.65v-6.21c0-.195-.2-.551-.367-.65l-5.248-3.104z\"/><path d=\"M12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-2a2 2 0 1 0 0-4 2 2 0 0 0 0 4z\"/></g></svg>"
  }, props));
};

AddonIcon.displayName = 'AddonIcon';
var _default = AddonIcon;
exports.default = _default;