"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _screen = _interopRequireDefault(require("@atlaskit/icon/core/screen"));
var _screen2 = _interopRequireDefault(require("@atlaskit/icon/glyph/screen"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are a work in progress and subject to change or removal in future minor or patch releases.
 * Please reach out in #help-design-system before using these in production.
 *
 * Migration Icon component for ScreenIcon.
 * This component is ScreenIcon, with `UNSAFE_fallbackIcon` set to "ScreenIcon".
 *
 * Category: Multi-purpose
 * Location: ADS
 * Usage guidance: Known uses: assets in Jira.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const ScreenIcon = props => /*#__PURE__*/_react.default.createElement(_screen.default, Object.assign({
  LEGACY_fallbackIcon: _screen2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
ScreenIcon.Name = 'ScreenIconMigration';
var _default = exports.default = ScreenIcon;