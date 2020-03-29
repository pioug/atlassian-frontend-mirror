"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var BitbucketForksIcon = function BitbucketForksIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><g fill=\"currentColor\" fill-rule=\"evenodd\"><path d=\"M3 12c0-.552.446-1 .998-1H12v2H3.998A.996.996 0 0 1 3 12z\"/><path d=\"M12 11V9c0-.551.45-1 1-1h6.395V6H13c-1.655 0-3 1.344-3 3v2h2zm-2 2v2c0 1.656 1.345 3 3 3h6.395v-2H13c-.55 0-1-.449-1-1v-2h-2z\" fill-rule=\"nonzero\"/><path d=\"M17.293 8.293a1 1 0 1 0 1.414 1.414l1.996-1.996a.999.999 0 0 0 0-1.422l-1.996-1.996a1 1 0 0 0-1.414 1.414L18.586 7l-1.293 1.293zm0 10a1 1 0 0 0 1.414 1.414l1.996-1.996a.999.999 0 0 0 0-1.422l-1.996-1.996a1 1 0 0 0-1.414 1.414L18.586 17l-1.293 1.293z\" fill-rule=\"nonzero\"/></g></svg>"
  }, props));
};

BitbucketForksIcon.displayName = 'BitbucketForksIcon';
var _default = BitbucketForksIcon;
exports.default = _default;