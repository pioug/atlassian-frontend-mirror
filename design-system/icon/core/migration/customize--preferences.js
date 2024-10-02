/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::f0471165b1411c9e3d53c4e3bf136cbc>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _customize = _interopRequireDefault(require("@atlaskit/icon/core/customize"));
var _preferences = _interopRequireDefault(require("@atlaskit/icon/glyph/preferences"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for CustomizeIcon.
 * This component is CustomizeIcon, with `UNSAFE_fallbackIcon` set to "PreferencesIcon".
 *
 * Category: multi-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Multi purpose - Known uses: customize sidebar, customize view, settings.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const CustomizeIcon = props => /*#__PURE__*/_react.default.createElement(_customize.default, Object.assign({
  LEGACY_fallbackIcon: _preferences.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
CustomizeIcon.Name = 'CustomizeIconMigration';
var _default = exports.default = CustomizeIcon;