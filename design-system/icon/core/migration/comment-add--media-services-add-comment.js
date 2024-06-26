"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _commentAdd = _interopRequireDefault(require("@atlaskit/icon/core/comment-add"));
var _addComment = _interopRequireDefault(require("@atlaskit/icon/glyph/media-services/add-comment"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are a work in progress and subject to change or removal in future minor or patch releases.
 * Please reach out in #help-design-system before using these in production.
 *
 * Migration Icon component for CommentAddIcon.
 * This component is CommentAddIcon, with `UNSAFE_fallbackIcon` set to "MediaServicesAddCommentIcon".
 *
 * Category: Single-purpose
 * Location: ADS
 * Usage guidance: Reserved for adding a comment to an object.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const CommentAddIcon = props => /*#__PURE__*/_react.default.createElement(_commentAdd.default, Object.assign({
  LEGACY_fallbackIcon: _addComment.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
CommentAddIcon.Name = 'CommentAddIconMigration';
var _default = exports.default = CommentAddIcon;