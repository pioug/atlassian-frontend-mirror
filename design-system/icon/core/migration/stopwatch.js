/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::3e189c4a599d81ae424744c77036b157>>
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
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for StopwatchIcon.
 * This component is StopwatchIcon, with `UNSAFE_fallbackIcon` set to "StopwatchIcon".
 *
 * Category: multi-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Multi purpose - Known uses: timer in Confluence Whiteboards.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const StopwatchIcon = props => /*#__PURE__*/_react.default.createElement(_stopwatch.default, Object.assign({
  name: "StopwatchIcon",
  LEGACY_fallbackIcon: _stopwatch2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
StopwatchIcon.displayName = 'StopwatchIconMigration';
var _default = exports.default = StopwatchIcon;