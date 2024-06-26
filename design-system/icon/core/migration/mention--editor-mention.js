"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _mention = _interopRequireDefault(require("@atlaskit/icon/core/mention"));
var _mention2 = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/mention"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are a work in progress and subject to change or removal in future minor or patch releases.
 * Please reach out in #help-design-system before using these in production.
 *
 * Migration Icon component for MentionIcon.
 * This component is MentionIcon, with `UNSAFE_fallbackIcon` set to "EditorMentionIcon".
 *
 * Category: Single-purpose
 * Location: Icon contributions
 * Usage guidance: Reserved for user mentions.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const MentionIcon = props => /*#__PURE__*/_react.default.createElement(_mention.default, Object.assign({
  LEGACY_fallbackIcon: _mention2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
MentionIcon.Name = 'MentionIconMigration';
var _default = exports.default = MentionIcon;