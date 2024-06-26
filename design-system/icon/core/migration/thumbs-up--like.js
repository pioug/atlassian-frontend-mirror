"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _thumbsUp = _interopRequireDefault(require("@atlaskit/icon/core/thumbs-up"));
var _like = _interopRequireDefault(require("@atlaskit/icon/glyph/like"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are a work in progress and subject to change or removal in future minor or patch releases.
 * Please reach out in #help-design-system before using these in production.
 *
 * Migration Icon component for ThumbsUpIcon.
 * This component is ThumbsUpIcon, with `UNSAFE_fallbackIcon` set to "LikeIcon".
 *
 * Category: Multi-purpose
 * Location: ADS
 * Usage guidance: Known uses: voting options in Jira, like
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const ThumbsUpIcon = props => /*#__PURE__*/_react.default.createElement(_thumbsUp.default, Object.assign({
  LEGACY_fallbackIcon: _like.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
ThumbsUpIcon.Name = 'ThumbsUpIconMigration';
var _default = exports.default = ThumbsUpIcon;