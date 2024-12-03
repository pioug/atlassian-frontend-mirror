/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::bf222d1dcbe5ccc57eb0665391152894>>
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
 * Icon: "Note".
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Single purpose - Reserved for notes.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const NoteIcon = props => /*#__PURE__*/_react.default.createElement(_baseNew.default, Object.assign({
  dangerouslySetGlyph: `<path stroke="currentcolor" stroke-linejoin="round" stroke-width="1.5" d="M14.25 9.75V3c0-.69-.56-1.25-1.25-1.25H3c-.69 0-1.25.56-1.25 1.25v10c0 .69.56 1.25 1.25 1.25h6.75m4.5-4.5h-4.5v4.5m4.5-4.5c0 .32-.127.627-.354.854l-3.292 3.292a1.2 1.2 0 0 1-.854.354M4 5.25h7m-7 3.5h3"/>`
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
NoteIcon.displayName = 'NoteIcon';
var _default = exports.default = NoteIcon;