/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::3c9c914f8f7a3631a5a598f1ef46602e>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _clock = _interopRequireDefault(require("@atlaskit/icon/core/clock"));
var _frequent = _interopRequireDefault(require("@atlaskit/icon/glyph/emoji/frequent"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for ClockIcon.
 * This component is ClockIcon, with `UNSAFE_fallbackIcon` set to "EmojiFrequentIcon".
 *
 * Category: multi-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Known uses: recent, time input, sprint time remaining, overdue task work type status.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const ClockIcon = props => /*#__PURE__*/_react.default.createElement(_clock.default, Object.assign({
  LEGACY_fallbackIcon: _frequent.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
ClockIcon.Name = 'ClockIconMigration';
var _default = exports.default = ClockIcon;