/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::59e43c1f00fcc95f49aa5b3733f7f372>>
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