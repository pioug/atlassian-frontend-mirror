"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _menu = _interopRequireDefault(require("@atlaskit/icon/core/menu"));
var _menuExpand = _interopRequireDefault(require("@atlaskit/icon/glyph/menu-expand"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are a work in progress and subject to change or removal in future minor or patch releases.
 * Please reach out in #help-design-system before using these in production.
 *
 * Migration Icon component for MenuIcon.
 * This component is MenuIcon, with `UNSAFE_fallbackIcon` set to "MenuExpandIcon".
 *
 * Category: Single-purpose
 * Location: ADS
 * Usage guidance: Reserved for accessing the menu in global product navigation.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const MenuIcon = props => /*#__PURE__*/_react.default.createElement(_menu.default, Object.assign({
  LEGACY_fallbackIcon: _menuExpand.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
MenuIcon.Name = 'MenuIconMigration';
var _default = exports.default = MenuIcon;