"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _base = require("@atlaskit/icon/base");
var _feedback = _interopRequireDefault(require("@atlaskit/icon/core/feedback"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const EditorFeedbackIcon = props => /*#__PURE__*/_react.default.createElement(_base.IconFacade, Object.assign({
  dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><path fill="currentcolor" d="M10.922 14.517 5.87 12.68l-.932-.339C4.418 12.151 4 11.552 4 11c0-.556.42-1.153.938-1.341l9.124-3.318c.52-.19.938.105.938.654v8.01c0 .54-.42.842-.938.654zM6 14.227l2 .728V17c0 .552-.405 1.202-.895 1.447l-.21.106C6.4 18.8 6 18.549 6 18.009zm11.224-4.78a.5.5 0 1 1-.448-.894l2-1a.5.5 0 1 1 .448.894zm-.448 4a.5.5 0 0 1 .448-.894l2 1a.5.5 0 0 1-.448.894zM17 11.5a.5.5 0 1 1 0-1h3a.5.5 0 1 1 0 1z"/></svg>`
}, props, {
  newIcon: _feedback.default
}));
EditorFeedbackIcon.displayName = 'EditorFeedbackIcon';
var _default = exports.default = EditorFeedbackIcon;