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
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are a work in progress and subject to change or removal in future minor or patch releases.
 * Please reach out in #help-design-system before using these in production.
 *
 * Migration Icon component for StopwatchIcon.
 * This component is StopwatchIcon, with `UNSAFE_fallbackIcon` set to "StopwatchIcon".
 *
 * Category: Multi-purpose
 * Location: ADS
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