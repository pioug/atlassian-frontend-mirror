/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::0441ce19299aaf81ff71e6deebb44887>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _department = _interopRequireDefault(require("@atlaskit/icon/core/department"));
var _department2 = _interopRequireDefault(require("@atlaskit/icon/glyph/department"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for DepartmentIcon.
 * This component is DepartmentIcon, with `UNSAFE_fallbackIcon` set to "DepartmentIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Single purpose - Reserved for departments, reporting lines, or other tree chart representations.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const DepartmentIcon = props => /*#__PURE__*/_react.default.createElement(_department.default, Object.assign({
  name: "DepartmentIcon",
  LEGACY_fallbackIcon: _department2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
DepartmentIcon.displayName = 'DepartmentIconMigration';
var _default = exports.default = DepartmentIcon;