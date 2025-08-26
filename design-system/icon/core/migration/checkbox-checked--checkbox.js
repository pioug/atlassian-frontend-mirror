/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::eca78c0aa7a66b058c7005abb4f00f69>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _checkboxChecked = _interopRequireDefault(require("@atlaskit/icon/core/checkbox-checked"));
var _checkbox = _interopRequireDefault(require("@atlaskit/icon/glyph/checkbox"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for CheckboxCheckedIcon.
 * This component is CheckboxCheckedIcon, with `UNSAFE_fallbackIcon` set to "CheckboxIcon".
 *
 * Category: multi-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Multi purpose - Reserved for interactive checkbox experiences. Consider using the checkbox component.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const CheckboxCheckedIcon = props => /*#__PURE__*/_react.default.createElement(_checkboxChecked.default, Object.assign({
  name: "CheckboxCheckedIcon",
  LEGACY_fallbackIcon: _checkbox.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
CheckboxCheckedIcon.displayName = 'CheckboxCheckedIconMigration';
var _default = exports.default = CheckboxCheckedIcon;