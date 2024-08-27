/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::b11a5f6661937524959067a139a20c3e>>
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
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
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
  LEGACY_fallbackIcon: _department2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
DepartmentIcon.Name = 'DepartmentIconMigration';
var _default = exports.default = DepartmentIcon;