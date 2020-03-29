"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var LikeIcon = function LikeIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><path d=\"M4 12v7a.971.971 0 0 0 .278.704.99.99 0 0 0 .701.296H6v-9H4.98a.99.99 0 0 0-.701.296A.971.971 0 0 0 4 12zm15.281-.96a3.046 3.046 0 0 0-2.321-1.061h-2.634c.04-.181.08-.36.11-.532.515-2.934 0-4-.504-4.594A2.432 2.432 0 0 0 12.075 4a3.078 3.078 0 0 0-2.968 2.751c-.393 1.839-.454 2-.968 2.725l-.768 1.089a2.011 2.011 0 0 0-.363 1.141v6.273c.001.532.216 1.041.596 1.416s.896.585 1.433.584h7.247a3.014 3.014 0 0 0 2.997-2.507l.677-4a2.963 2.963 0 0 0-.677-2.432zm-1.998 6.1a1.007 1.007 0 0 1-1 .835H9.038v-6.269l.767-1.089a7.577 7.577 0 0 0 1.302-3.509c.036-.543.255-1.209.969-1.108.714.1.575 1.916.363 3.1a19.712 19.712 0 0 1-.868 2.882l5.39-.008c.297-.001.58.128.773.352a.993.993 0 0 1 .226.813l-.676 4.001z\" fill=\"currentColor\" fill-rule=\"evenodd\"/></svg>"
  }, props));
};

LikeIcon.displayName = 'LikeIcon';
var _default = LikeIcon;
exports.default = _default;