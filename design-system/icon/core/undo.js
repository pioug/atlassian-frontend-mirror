/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::66f045eb9956688cd494d9505ef96ad7>>
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
 * Icon: "Undo".
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Single purpose - Reserved for undo in Editor.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const UndoIcon = props => /*#__PURE__*/_react.default.createElement(_baseNew.default, Object.assign({
  dangerouslySetGlyph: `<path stroke="currentcolor" stroke-linejoin="round" stroke-width="1.5" d="M8 13.25h2.25a4 4 0 0 0 0-8h-8m3-3.5-3.5 3.5 3.5 3.5"/>`
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
UndoIcon.displayName = 'UndoIcon';
var _default = exports.default = UndoIcon;