"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var EditorMentionIcon = function EditorMentionIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><path d=\"M12.062 13.93c-.904 0-1.451-.734-1.451-1.945 0-1.226.538-1.952 1.466-1.952.928 0 1.422.764 1.422 1.967 0 1.195-.502 1.93-1.438 1.93M12 5c-3.925 0-7 3.075-7 7 0 4.596 3.522 7 7 7 .874 0 1.614-.09 2.26-.279a.751.751 0 0 0-.42-1.44c-.508.147-1.11.22-1.84.22-2.648 0-5.5-1.722-5.5-5.5 0-3.085 2.417-5.5 5.5-5.5 3.24 0 5.5 1.952 5.5 4.75 0 2.045-1.043 3-1.748 3-.008 0-.752-.11-.752-.75v-4a.75.75 0 1 0-1.5 0v.187c-.346-.585-1.016-.952-1.795-.952C10.102 8.736 9 10.04 9 11.938c0 1.984 1.103 3.312 2.753 3.312.865 0 1.51-.387 1.865-1.076.334 1.016 1.37 1.576 2.132 1.576 1.598 0 3.25-1.683 3.25-4.5C19 7.628 16.058 5 12 5\" fill=\"currentColor\" fill-rule=\"evenodd\"/></svg>"
  }, props));
};

EditorMentionIcon.displayName = 'EditorMentionIcon';
var _default = EditorMentionIcon;
exports.default = _default;