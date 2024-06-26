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
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are a work in progress and subject to change or removal in future minor or patch releases.
 * Please reach out in #help-design-system before using these in production.
 *
 * Migration Icon component for DepartmentIcon.
 * This component is DepartmentIcon, with `UNSAFE_fallbackIcon` set to "DepartmentIcon".
 *
 * Category: Single-purpose
 * Location: Icon contributions
 * Usage guidance: Reserved for departments, reporting lines, or other tree chart representations.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const DepartmentIcon = props => /*#__PURE__*/_react.default.createElement(_department.default, Object.assign({
  LEGACY_fallbackIcon: _department2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
DepartmentIcon.Name = 'DepartmentIconMigration';
var _default = exports.default = DepartmentIcon;