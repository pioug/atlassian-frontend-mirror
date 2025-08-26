/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::f4ab52fe73f2788cd5bc16868806adf4>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _textIndentLeft = _interopRequireDefault(require("@atlaskit/icon/core/text-indent-left"));
var _outdent = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/outdent"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for TextIndentLeftIcon.
 * This component is TextIndentLeftIcon, with `UNSAFE_fallbackIcon` set to "EditorOutdentIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Single purpose - Reserved for shifting the indent of text content left.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const TextIndentLeftIcon = props => /*#__PURE__*/_react.default.createElement(_textIndentLeft.default, Object.assign({
  name: "TextIndentLeftIcon",
  LEGACY_fallbackIcon: _outdent.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
TextIndentLeftIcon.displayName = 'TextIndentLeftIconMigration';
var _default = exports.default = TextIndentLeftIcon;