/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::315758a81f797b033fc6adebe81008e6>>
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
 * Icon: "Theme".
 * Category: single-purpose
 * Location: @atlaskit/icon/core/theme
 * Usage guidance:
 * Single purpose - Reserved for representing themes and theme switching.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const ThemeIcon = props => /*#__PURE__*/_react.default.createElement(_iconNew.default, Object.assign({
  name: "ThemeIcon",
  dangerouslySetGlyph: `<path fill="currentcolor" fill-rule="evenodd" d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m7.25-5H8a5 5 0 0 1 0 10h-.75z" clip-rule="evenodd"/>`
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
ThemeIcon.displayName = 'ThemeIcon';
var _default = exports.default = ThemeIcon;