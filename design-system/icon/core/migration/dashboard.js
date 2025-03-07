/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::7183201509c40b5c08006bcaf851f797>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _dashboard = _interopRequireDefault(require("@atlaskit/icon/core/dashboard"));
var _dashboard2 = _interopRequireDefault(require("@atlaskit/icon/glyph/dashboard"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for DashboardIcon.
 * This component is DashboardIcon, with `UNSAFE_fallbackIcon` set to "DashboardIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Single purpose - Reserved for dashboards in Jira.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const DashboardIcon = props => /*#__PURE__*/_react.default.createElement(_dashboard.default, Object.assign({
  LEGACY_fallbackIcon: _dashboard2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
DashboardIcon.Name = 'DashboardIconMigration';
var _default = exports.default = DashboardIcon;