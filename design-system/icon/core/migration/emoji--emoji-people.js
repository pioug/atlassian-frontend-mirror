"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _emoji = _interopRequireDefault(require("@atlaskit/icon/core/emoji"));
var _people = _interopRequireDefault(require("@atlaskit/icon/glyph/emoji/people"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are a work in progress and subject to change or removal in future minor or patch releases.
 * Please reach out in #help-design-system before using these in production.
 *
 * Migration Icon component for EmojiIcon.
 * This component is EmojiIcon, with `UNSAFE_fallbackIcon` set to "EmojiPeopleIcon".
 *
 * Category: Single-purpose
 * Location: Icon contributions
 * Usage guidance: Reserved for Editor as a category for Emoji's.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const EmojiIcon = props => /*#__PURE__*/_react.default.createElement(_emoji.default, Object.assign({
  LEGACY_fallbackIcon: _people.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
EmojiIcon.Name = 'EmojiIconMigration';
var _default = exports.default = EmojiIcon;