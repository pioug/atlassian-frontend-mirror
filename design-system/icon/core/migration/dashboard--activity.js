/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::cad0b95dcd2c3b1cde260d200ff50239>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _dashboard = _interopRequireDefault(require("@atlaskit/icon/core/dashboard"));
var _activity = _interopRequireDefault(require("@atlaskit/icon/glyph/activity"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for DashboardIcon.
 * This component is DashboardIcon, with `UNSAFE_fallbackIcon` set to "ActivityIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Reserved for dashboards in Jira.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const DashboardIcon = props => /*#__PURE__*/_react.default.createElement(_dashboard.default, Object.assign({
  LEGACY_fallbackIcon: _activity.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
DashboardIcon.Name = 'DashboardIconMigration';
var _default = exports.default = DashboardIcon;