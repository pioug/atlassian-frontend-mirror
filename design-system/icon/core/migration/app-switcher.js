/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::9a6526ba72ad9bbb4f9b91ad0dbd2f69>>
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
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for AppSwitcherIcon.
 * This component is AppSwitcherIcon, with `UNSAFE_fallbackIcon` set to "AppSwitcherIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Single purpose - Reserved for app switcher in global product navigation.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const AppSwitcherIcon = props => /*#__PURE__*/_react.default.createElement(_appSwitcher.default, Object.assign({
  LEGACY_fallbackIcon: _appSwitcher2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
AppSwitcherIcon.Name = 'AppSwitcherIconMigration';
var _default = exports.default = AppSwitcherIcon;