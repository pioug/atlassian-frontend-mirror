/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::113cd4523810e6c9fe05d0e52a1ca1f4>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _iconNew = _interopRequireDefault(require("@atlaskit/icon/components/icon-new"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Icon: "Menu".
 * Category: single-purpose
 * Location: @atlaskit/icon/core/menu
 * Usage guidance:
 * Single purpose - Reserved for accessing the menu in global app navigation.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const MenuIcon = props => /*#__PURE__*/_react.default.createElement(_iconNew.default, Object.assign({
  name: "MenuIcon",
  dangerouslySetGlyph: `<path fill="currentcolor" d="M15 12.5V14H1v-1.5zm0-5.25v1.5H1v-1.5zM15 2v1.5H1V2z"/>`
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
MenuIcon.displayName = 'MenuIcon';
var _default = exports.default = MenuIcon;