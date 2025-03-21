"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _base = require("@atlaskit/icon/base");
var _emoji = _interopRequireDefault(require("@atlaskit/icon/core/emoji"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const EmojiEmojiIcon = props => /*#__PURE__*/_react.default.createElement(_base.IconFacade, Object.assign({
  dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><path fill="currentcolor" fill-rule="evenodd" d="M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18m0-2a7 7 0 1 0 0-14 7 7 0 0 0 0 14m-3.95-4.803c-.167-.477.102-.991.601-1.15.5-.159 1.039.099 1.205.575.06.174.225.487.495.796.426.488.956.764 1.649.764s1.223-.276 1.65-.764c.27-.31.433-.622.494-.796.166-.476.706-.734 1.205-.575s.768.673.602 1.15a4.4 4.4 0 0 1-.839 1.385C14.348 16.458 13.306 17 12 17s-2.348-.542-3.112-1.418a4.4 4.4 0 0 1-.839-1.385M9.5 11a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3"/></svg>`
}, props, {
  newIcon: _emoji.default
}));
EmojiEmojiIcon.displayName = 'EmojiEmojiIcon';
var _default = exports.default = EmojiEmojiIcon;