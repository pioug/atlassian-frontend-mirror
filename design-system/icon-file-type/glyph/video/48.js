"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var Video48Icon = function Video48Icon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"48\" height=\"64\" viewBox=\"0 0 48 64\" focusable=\"false\" role=\"presentation\"><g fill-rule=\"evenodd\"><path fill=\"#FFF\" stroke=\"#091E42\" stroke-opacity=\".08\" d=\"M4 .5h28.007a3.5 3.5 0 0 1 2.52 1.072l11.994 12.45a3.5 3.5 0 0 1 .979 2.429V60a3.5 3.5 0 0 1-3.5 3.5H4A3.5 3.5 0 0 1 .5 60V4A3.5 3.5 0 0 1 4 .5z\"/><path fill=\"#FF5630\" d=\"M14.667 27.161c0-.549.443-.994.994-.994h9.678c.549 0 .994.443.994.994v9.678a.993.993 0 0 1-.994.994H15.66a.993.993 0 0 1-.994-.994V27.16zm17.686 9.434l-3.686-1.784v-5.62l3.686-1.786c.444-.215.98.078.98.533v8.124c0 .455-.536.748-.98.533z\"/></g></svg>"
  }, props, {
    size: "xlarge"
  }));
};

Video48Icon.displayName = 'Video48Icon';
var _default = Video48Icon;
exports.default = _default;