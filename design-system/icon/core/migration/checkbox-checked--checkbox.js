/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::9905efc7e38f6e3f455098a348088190>>
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
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for CheckboxCheckedIcon.
 * This component is CheckboxCheckedIcon, with `UNSAFE_fallbackIcon` set to "CheckboxIcon".
 *
 * Category: multi-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Reserved for interactive checkbox experiences. Consider using the checkbox component.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const CheckboxCheckedIcon = props => /*#__PURE__*/_react.default.createElement(_checkboxChecked.default, Object.assign({
  LEGACY_fallbackIcon: _checkbox.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
CheckboxCheckedIcon.Name = 'CheckboxCheckedIconMigration';
var _default = exports.default = CheckboxCheckedIcon;