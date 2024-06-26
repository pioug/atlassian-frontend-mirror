"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _heart = _interopRequireDefault(require("@atlaskit/icon/core/heart"));
var _symbols = _interopRequireDefault(require("@atlaskit/icon/glyph/emoji/symbols"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are a work in progress and subject to change or removal in future minor or patch releases.
 * Please reach out in #help-design-system before using these in production.
 *
 * Migration Icon component for HeartIcon.
 * This component is HeartIcon, with `UNSAFE_fallbackIcon` set to "EmojiSymbolsIcon".
 *
 * Category: Multi-purpose
 * Location: Icon contributions
 * Usage guidance: Known uses: emoji symbols in Editor.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const HeartIcon = props => /*#__PURE__*/_react.default.createElement(_heart.default, Object.assign({
  LEGACY_fallbackIcon: _symbols.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
HeartIcon.Name = 'HeartIconMigration';
var _default = exports.default = HeartIcon;