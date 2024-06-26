"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _textStyle = _interopRequireDefault(require("@atlaskit/icon/core/text-style"));
var _keyboard = _interopRequireDefault(require("@atlaskit/icon/glyph/emoji/keyboard"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are a work in progress and subject to change or removal in future minor or patch releases.
 * Please reach out in #help-design-system before using these in production.
 *
 * Migration Icon component for TextStyleIcon.
 * This component is TextStyleIcon, with `UNSAFE_fallbackIcon` set to "EmojiKeyboardIcon".
 *
 * Category: Single-purpose
 * Location: Icon contributions
 * Usage guidance: Reserved for text styles in Editor.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const TextStyleIcon = props => /*#__PURE__*/_react.default.createElement(_textStyle.default, Object.assign({
  LEGACY_fallbackIcon: _keyboard.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
TextStyleIcon.Name = 'TextStyleIconMigration';
var _default = exports.default = TextStyleIcon;