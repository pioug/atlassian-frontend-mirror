"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var EditorUndoIcon = function EditorUndoIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><path d=\"M8.931 11.658C9.92 10.055 11.596 9 13.5 9c3.038 0 5.492 2.686 5.5 6h-1.5c0-2.513-1.821-4.5-4-4.5-1.337 0-2.54.749-3.27 1.908l2.03 1.172c.24.139.22.325-.029.41l-2.73.93L9.5 15v-.08l-1.372.467a.422.422 0 0 1-.559-.323l-.84-4.251c-.053-.266.106-.365.34-.23l1.862 1.075z\" fill=\"currentColor\"/></svg>"
  }, props));
};

EditorUndoIcon.displayName = 'EditorUndoIcon';
var _default = EditorUndoIcon;
exports.default = _default;