/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::dfb8e24ad0aeafedb3c07855964a196e>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _comment = _interopRequireDefault(require("@atlaskit/icon/core/comment"));
var _comment2 = _interopRequireDefault(require("@atlaskit/icon/glyph/comment"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for CommentIcon.
 * This component is CommentIcon, with `UNSAFE_fallbackIcon` set to "CommentIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Single purpose - Reserved for comments on objects.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const CommentIcon = props => /*#__PURE__*/_react.default.createElement(_comment.default, Object.assign({
  LEGACY_fallbackIcon: _comment2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
CommentIcon.Name = 'CommentIconMigration';
var _default = exports.default = CommentIcon;