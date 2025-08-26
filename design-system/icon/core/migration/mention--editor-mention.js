/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::c3fc51bb51ce6dba844d651a03b45347>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _mention = _interopRequireDefault(require("@atlaskit/icon/core/mention"));
var _mention2 = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/mention"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for MentionIcon.
 * This component is MentionIcon, with `UNSAFE_fallbackIcon` set to "EditorMentionIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Single purpose - Reserved for user mentions.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const MentionIcon = props => /*#__PURE__*/_react.default.createElement(_mention.default, Object.assign({
  name: "MentionIcon",
  LEGACY_fallbackIcon: _mention2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
MentionIcon.displayName = 'MentionIconMigration';
var _default = exports.default = MentionIcon;