/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::7b29c688e198c5697ad96595c7e7cd5e>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _appSwitcher = _interopRequireDefault(require("@atlaskit/icon/core/app-switcher"));
var _appSwitcher2 = _interopRequireDefault(require("@atlaskit/icon/glyph/app-switcher"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for AppSwitcherIcon.
 * This component is AppSwitcherIcon, with `UNSAFE_fallbackIcon` set to "AppSwitcherIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Reserved for app switcher in global product navigation.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const AppSwitcherIcon = props => /*#__PURE__*/_react.default.createElement(_appSwitcher.default, Object.assign({
  LEGACY_fallbackIcon: _appSwitcher2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
AppSwitcherIcon.Name = 'AppSwitcherIconMigration';
var _default = exports.default = AppSwitcherIcon;