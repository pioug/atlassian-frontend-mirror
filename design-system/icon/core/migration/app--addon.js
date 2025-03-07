/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::0f847d1cd9da5a4c2f8db9579d329d66>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _app = _interopRequireDefault(require("@atlaskit/icon/core/app"));
var _addon = _interopRequireDefault(require("@atlaskit/icon/glyph/addon"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for AppIcon.
 * This component is AppIcon, with `UNSAFE_fallbackIcon` set to "AddonIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Single purpose - Reserved for marketplace apps and integrations across products.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const AppIcon = props => /*#__PURE__*/_react.default.createElement(_app.default, Object.assign({
  LEGACY_fallbackIcon: _addon.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
AppIcon.Name = 'AppIconMigration';
var _default = exports.default = AppIcon;