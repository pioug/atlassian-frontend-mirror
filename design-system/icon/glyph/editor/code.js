"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var EditorCodeIcon = function EditorCodeIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><path d=\"M10.208 7.308a1.09 1.09 0 0 1 0 1.483l-3.515 3.71 3.515 3.708a1.09 1.09 0 0 1 0 1.483.957.957 0 0 1-1.405 0l-3.866-4.08a1.635 1.635 0 0 1 0-2.225l3.866-4.08a.957.957 0 0 1 1.405 0zm3.584 0a.957.957 0 0 1 1.405 0l3.866 4.08c.583.614.583 1.61 0 2.225l-3.866 4.08a.957.957 0 0 1-1.405 0 1.09 1.09 0 0 1 0-1.484l3.515-3.708-3.515-3.71a1.09 1.09 0 0 1 0-1.483z\" fill=\"currentColor\" fill-rule=\"evenodd\"/></svg>"
  }, props));
};

EditorCodeIcon.displayName = 'EditorCodeIcon';
var _default = EditorCodeIcon;
exports.default = _default;