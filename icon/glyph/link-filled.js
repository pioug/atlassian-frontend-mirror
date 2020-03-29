"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var LinkFilledIcon = function LinkFilledIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><g fill-rule=\"evenodd\"><circle fill=\"currentColor\" cx=\"12\" cy=\"12\" r=\"10\"/><path d=\"M11.75 16.15l.548-.537a.585.585 0 0 0 0-.838.61.61 0 0 0-.854 0l-.574.564c-.564.553-1.483.662-2.101.168a1.482 1.482 0 0 1-.119-2.223l1.694-1.663a1.543 1.543 0 0 1 2.156 0l.647.635.853-.839-.646-.635a2.775 2.775 0 0 0-3.863 0l-1.694 1.664a2.659 2.659 0 0 0 .208 3.979c1.104.884 2.738.715 3.746-.275\" fill=\"inherit\"/><path d=\"M12.25 7.85l-.547.537a.585.585 0 0 0 0 .838.61.61 0 0 0 .853 0l.574-.564c.564-.553 1.483-.662 2.101-.168.71.57.75 1.603.119 2.223l-1.694 1.663a1.543 1.543 0 0 1-2.156 0l-.647-.635-.853.839.646.635a2.775 2.775 0 0 0 3.863 0l1.695-1.664a2.659 2.659 0 0 0-.209-3.979c-1.104-.884-2.738-.715-3.746.275\" fill=\"inherit\"/></g></svg>"
  }, props));
};

LinkFilledIcon.displayName = 'LinkFilledIcon';
var _default = LinkFilledIcon;
exports.default = _default;