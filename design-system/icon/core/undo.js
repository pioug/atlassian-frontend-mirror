/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::fd1cfcbb5080c9044de22389be7f741e>>
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
 * Icon: "Undo".
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Single purpose - Reserved for undo in Editor.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const UndoIcon = props => /*#__PURE__*/_react.default.createElement(_baseNew.default, Object.assign({
  name: "UndoIcon",
  dangerouslySetGlyph: `<path fill="currentcolor" fill-rule="evenodd" d="m1.22 4.72 3.5-3.5 1.06 1.06L3.56 4.5h6.69a4.75 4.75 0 1 1 0 9.5H8v-1.5h2.25a3.25 3.25 0 0 0 0-6.5H3.56l2.22 2.22-1.06 1.06-3.5-3.5a.75.75 0 0 1 0-1.06" clip-rule="evenodd"/>`
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
UndoIcon.displayName = 'UndoIcon';
var _default = exports.default = UndoIcon;