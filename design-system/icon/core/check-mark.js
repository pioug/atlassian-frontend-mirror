/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::97fadb77040fc214fca377f612fb6ef3>>
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
 * Icon: "CheckMark".
 * Category: multi-purpose
 * Location: @atlaskit/icon/core/check-mark
 * Usage guidance:
 * Multi purpose - Known uses: table cells, checkboxes.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const CheckMarkIcon = props => /*#__PURE__*/_react.default.createElement(_iconNew.default, Object.assign({
  name: "CheckMarkIcon",
  dangerouslySetGlyph: `<path fill="currentcolor" d="m13.959 3.97-7.25 9a.75.75 0 0 1-1.163.007l-3.5-4.25 1.158-.954 2.914 3.539 6.673-8.283z"/>`
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
CheckMarkIcon.displayName = 'CheckMarkIcon';
var _default = exports.default = CheckMarkIcon;