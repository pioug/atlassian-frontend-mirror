/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::c569be0f57e772a1c4c099f3f533a642>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _checkboxIndeterminate = _interopRequireDefault(require("@atlaskit/icon/core/checkbox-indeterminate"));
var _checkboxIndeterminate2 = _interopRequireDefault(require("@atlaskit/icon/glyph/checkbox-indeterminate"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for CheckboxIndeterminateIcon.
 * This component is CheckboxIndeterminateIcon, with `UNSAFE_fallbackIcon` set to "CheckboxIndeterminateIcon".
 *
 * Category: multi-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Reserved for interactive checkbox experiences. Consider using the checkbox component.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const CheckboxIndeterminateIcon = props => /*#__PURE__*/_react.default.createElement(_checkboxIndeterminate.default, Object.assign({
  LEGACY_fallbackIcon: _checkboxIndeterminate2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
CheckboxIndeterminateIcon.Name = 'CheckboxIndeterminateIconMigration';
var _default = exports.default = CheckboxIndeterminateIcon;