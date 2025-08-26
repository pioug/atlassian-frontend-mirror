/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::867a6194526fa34c6d6fab21c511abd3>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _tag = _interopRequireDefault(require("@atlaskit/icon/core/tag"));
var _label = _interopRequireDefault(require("@atlaskit/icon/glyph/label"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for TagIcon.
 * This component is TagIcon, with `UNSAFE_fallbackIcon` set to "LabelIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Single purpose - Reserved for tags in Atlas.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const TagIcon = props => /*#__PURE__*/_react.default.createElement(_tag.default, Object.assign({
  name: "TagIcon",
  LEGACY_fallbackIcon: _label.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
TagIcon.displayName = 'TagIconMigration';
var _default = exports.default = TagIcon;