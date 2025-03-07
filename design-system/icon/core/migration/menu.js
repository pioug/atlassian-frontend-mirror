/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::df9f54c5ab53475ca091cb575b7018b6>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _menu = _interopRequireDefault(require("@atlaskit/icon/core/menu"));
var _menu2 = _interopRequireDefault(require("@atlaskit/icon/glyph/menu"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for MenuIcon.
 * This component is MenuIcon, with `UNSAFE_fallbackIcon` set to "MenuIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Single purpose - Reserved for accessing the menu in global product navigation.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const MenuIcon = props => /*#__PURE__*/_react.default.createElement(_menu.default, Object.assign({
  LEGACY_fallbackIcon: _menu2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
MenuIcon.Name = 'MenuIconMigration';
var _default = exports.default = MenuIcon;