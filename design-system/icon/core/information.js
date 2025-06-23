/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::d43a7428702b82788297fb999fe29f0a>>
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
 * Icon: "Information".
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Reserved for information statuses and messaging. 
Filled status icons provide higher visual contrast to draw attention to important information.
For information tooltips, use the unfilled 'information circle' icon.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const InformationIcon = props => /*#__PURE__*/_react.default.createElement(_baseNew.default, Object.assign({
  dangerouslySetGlyph: `<path fill="currentcolor" fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m6.5-1.25H8a.75.75 0 0 1 .75.75v5h-1.5V8.25H6.5zM8 5.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2" clip-rule="evenodd"/>`
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
InformationIcon.displayName = 'InformationIcon';
var _default = exports.default = InformationIcon;