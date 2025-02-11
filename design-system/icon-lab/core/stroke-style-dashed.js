/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::030a89c3937821ac62cd21772b5aeaab>>
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
 * Icon: "StrokeStyleDashed".
 * Category: single-purpose
 * Location: @atlaskit/icon-lab
 * Usage guidance: Reserved for representing dashed stroke and border styles.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const StrokeStyleDashedIcon = props => /*#__PURE__*/_react.default.createElement(_baseNew.default, Object.assign({
  dangerouslySetGlyph: `<path stroke="currentcolor" stroke-linejoin="round" stroke-width="1.5" d="M1 8h3.33m2 0h3.33m2.01 0H15"/>`
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
StrokeStyleDashedIcon.displayName = 'StrokeStyleDashedIcon';
var _default = exports.default = StrokeStyleDashedIcon;