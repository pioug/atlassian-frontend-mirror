"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _comment = _interopRequireDefault(require("@atlaskit/icon/core/comment"));
var _questions = _interopRequireDefault(require("@atlaskit/icon/glyph/questions"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are a work in progress and subject to change or removal in future minor or patch releases.
 * Please reach out in #help-design-system before using these in production.
 *
 * Migration Icon component for CommentIcon.
 * This component is CommentIcon, with `UNSAFE_fallbackIcon` set to "QuestionsIcon".
 *
 * Category: Single-purpose
 * Location: ADS
 * Usage guidance: Reserved for comments on objects.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const CommentIcon = props => /*#__PURE__*/_react.default.createElement(_comment.default, Object.assign({
  LEGACY_fallbackIcon: _questions.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
CommentIcon.Name = 'CommentIconMigration';
var _default = exports.default = CommentIcon;