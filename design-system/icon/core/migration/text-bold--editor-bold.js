/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::eb348b360039884cef651f2a24458acd>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _textBold = _interopRequireDefault(require("@atlaskit/icon/core/text-bold"));
var _bold = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/bold"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for TextBoldIcon.
 * This component is TextBoldIcon, with `UNSAFE_fallbackIcon` set to "EditorBoldIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Single purpose - Reserved for bolding text.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const TextBoldIcon = props => /*#__PURE__*/_react.default.createElement(_textBold.default, Object.assign({
  LEGACY_fallbackIcon: _bold.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
TextBoldIcon.Name = 'TextBoldIconMigration';
var _default = exports.default = TextBoldIcon;