/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::4a9009735b9e2638a41af77e09ece007>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _commentAdd = _interopRequireDefault(require("@atlaskit/icon/core/comment-add"));
var _addComment = _interopRequireDefault(require("@atlaskit/icon/glyph/media-services/add-comment"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for CommentAddIcon.
 * This component is CommentAddIcon, with `UNSAFE_fallbackIcon` set to "MediaServicesAddCommentIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Single purpose - Reserved for adding a comment to an object.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const CommentAddIcon = props => /*#__PURE__*/_react.default.createElement(_commentAdd.default, Object.assign({
  name: "CommentAddIcon",
  LEGACY_fallbackIcon: _addComment.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
CommentAddIcon.displayName = 'CommentAddIconMigration';
var _default = exports.default = CommentAddIcon;