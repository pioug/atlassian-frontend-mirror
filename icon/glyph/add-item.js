"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var AddItemIcon = function AddItemIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><g fill=\"currentColor\" fill-rule=\"evenodd\"><path d=\"M16.002 3H4.995A1.995 1.995 0 0 0 3 4.995v14.01C3 20.107 3.893 21 4.995 21h14.01A1.995 1.995 0 0 0 21 19.005V7.998 11h-2v8H5V5h8V3h3.002z\" fill-rule=\"nonzero\"/><path d=\"M19 5V3.99A1 1 0 0 0 18 3c-.556 0-1 .444-1 .99V5h-1a1 1 0 0 0 0 2h1v1.01A1 1 0 0 0 18 9c.556 0 1-.444 1-.99V7h1a1 1 0 0 0 0-2h-1z\"/></g></svg>"
  }, props));
};

AddItemIcon.displayName = 'AddItemIcon';
var _default = AddItemIcon;
exports.default = _default;