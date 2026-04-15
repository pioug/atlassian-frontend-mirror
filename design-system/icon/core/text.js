/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::2ff5f4ad7fad9250ed5be195811970f0>>
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
 * Icon: "Text".
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Single purpose - Reserved for representing text objects.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const TextIcon = props => /*#__PURE__*/_react.default.createElement(_baseNew.default, Object.assign({
  name: "TextIcon",
  dangerouslySetGlyph: `<path fill="currentcolor" d="M11 1v1.5H6.25V15h-1.5V2.5H0V1zm1 12V8h-2V6.5h2V4h1.5v2.5H16V8h-2.5v5a.5.5 0 0 0 .5.5h2V15h-2a2 2 0 0 1-2-2"/>`
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
TextIcon.displayName = 'TextIcon';
var _default = exports.default = TextIcon;