/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::906b6eb41318cb425054ed8322e3307d>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _stopwatch = _interopRequireDefault(require("@atlaskit/icon/core/stopwatch"));
var _stopwatch2 = _interopRequireDefault(require("@atlaskit/icon/glyph/stopwatch"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for StopwatchIcon.
 * This component is StopwatchIcon, with `UNSAFE_fallbackIcon` set to "StopwatchIcon".
 *
 * Category: multi-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Known uses: timer in Confluence Whiteboards
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const StopwatchIcon = props => /*#__PURE__*/_react.default.createElement(_stopwatch.default, Object.assign({
  LEGACY_fallbackIcon: _stopwatch2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
StopwatchIcon.Name = 'StopwatchIconMigration';
var _default = exports.default = StopwatchIcon;