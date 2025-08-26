/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::5b781ae7916da76ce23508b640931263>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _textIndentRight = _interopRequireDefault(require("@atlaskit/icon/core/text-indent-right"));
var _indent = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/indent"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for TextIndentRightIcon.
 * This component is TextIndentRightIcon, with `UNSAFE_fallbackIcon` set to "EditorIndentIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Single purpose - Reserved for shifting the indent of text content right.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const TextIndentRightIcon = props => /*#__PURE__*/_react.default.createElement(_textIndentRight.default, Object.assign({
  name: "TextIndentRightIcon",
  LEGACY_fallbackIcon: _indent.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
TextIndentRightIcon.displayName = 'TextIndentRightIconMigration';
var _default = exports.default = TextIndentRightIcon;