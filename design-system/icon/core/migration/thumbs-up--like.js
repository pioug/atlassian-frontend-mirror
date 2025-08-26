/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::3711a8e46726b47c958632ee6c073e5b>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _thumbsUp = _interopRequireDefault(require("@atlaskit/icon/core/thumbs-up"));
var _like = _interopRequireDefault(require("@atlaskit/icon/glyph/like"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for ThumbsUpIcon.
 * This component is ThumbsUpIcon, with `UNSAFE_fallbackIcon` set to "LikeIcon".
 *
 * Category: multi-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Multi purpose - Known uses: voting options in Jira, like.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const ThumbsUpIcon = props => /*#__PURE__*/_react.default.createElement(_thumbsUp.default, Object.assign({
  name: "ThumbsUpIcon",
  LEGACY_fallbackIcon: _like.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
ThumbsUpIcon.displayName = 'ThumbsUpIconMigration';
var _default = exports.default = ThumbsUpIcon;