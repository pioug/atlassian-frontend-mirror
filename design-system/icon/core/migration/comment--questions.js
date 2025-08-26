/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::cb87bbb195e8ebfd131c8e3a3e4b2c78>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _comment = _interopRequireDefault(require("@atlaskit/icon/core/comment"));
var _questions = _interopRequireDefault(require("@atlaskit/icon/glyph/questions"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for CommentIcon.
 * This component is CommentIcon, with `UNSAFE_fallbackIcon` set to "QuestionsIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Single purpose - Reserved for comments on objects.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const CommentIcon = props => /*#__PURE__*/_react.default.createElement(_comment.default, Object.assign({
  name: "CommentIcon",
  LEGACY_fallbackIcon: _questions.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
CommentIcon.displayName = 'CommentIconMigration';
var _default = exports.default = CommentIcon;