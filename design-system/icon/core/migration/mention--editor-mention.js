/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::58108580e85d4f5efd06229537a60463>>
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
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
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
  LEGACY_fallbackIcon: _mention2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
MentionIcon.Name = 'MentionIconMigration';
var _default = exports.default = MentionIcon;