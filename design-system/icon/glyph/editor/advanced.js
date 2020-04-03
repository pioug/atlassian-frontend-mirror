"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var EditorAdvancedIcon = function EditorAdvancedIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><path d=\"M9.8 17L9 19H7l.763-2H9.8zm-.893-3l1.907-5h2.372l1.907 5h-1.926L12 10.5 10.833 14H8.907zm7.33 3L17 19h-2l-.8-2h2.037zM5 15h14v1H5v-1zM18 5v1h-2v2h2v1h-3V5h3zm0 1h1v2h-1V6z\" fill=\"currentColor\" fill-rule=\"evenodd\"/></svg>"
  }, props));
};

EditorAdvancedIcon.displayName = 'EditorAdvancedIcon';
var _default = EditorAdvancedIcon;
exports.default = _default;