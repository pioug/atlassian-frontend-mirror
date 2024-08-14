/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::e08731b96f2bf5f6ed36d9481b96ac47>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _UNSAFE_baseNew = _interopRequireDefault(require("@atlaskit/icon/UNSAFE_base-new"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 * Please reach out in #icon-contributions before using these in production.
 *
 * Icon: "Undo".
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Reserved for undo in Editor.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const UndoIcon = props => /*#__PURE__*/_react.default.createElement(_UNSAFE_baseNew.default, Object.assign({
  dangerouslySetGlyph: `<path stroke="currentColor" stroke-linejoin="round" stroke-width="1.5" d="M1.75 5.25h8.5a4 4 0 0 1 0 8H8"/><path stroke="currentColor" stroke-linejoin="round" stroke-width="1.5" d="m5.25 1.75-3.5 3.5 3.5 3.5"/>`
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
UndoIcon.displayName = 'UndoIcon';
var _default = exports.default = UndoIcon;