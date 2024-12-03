/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::2a862b50fdd15cbe9aea93b01af9a5cb>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _baseNew = _interopRequireDefault(require("@atlaskit/icon/base-new"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 * Please reach out in #icon-contributions before using these in production.
 *
 * Icon: "Menu".
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Single purpose - Reserved for accessing the menu in global product navigation.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const MenuIcon = props => /*#__PURE__*/_react.default.createElement(_baseNew.default, Object.assign({
  dangerouslySetGlyph: `<path stroke="currentcolor" stroke-width="1.5" d="M1 13.25h14M1 8h14M1 2.75h14"/>`
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
MenuIcon.displayName = 'MenuIcon';
var _default = exports.default = MenuIcon;