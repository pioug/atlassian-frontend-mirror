/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::e144f9373c9192c67a3a1d1119b0fc85>>
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
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for TagIcon.
 * This component is TagIcon, with `UNSAFE_fallbackIcon` set to "LabelIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Reserved for tags in Atlas.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const TagIcon = props => /*#__PURE__*/_react.default.createElement(_tag.default, Object.assign({
  LEGACY_fallbackIcon: _label.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
TagIcon.Name = 'TagIconMigration';
var _default = exports.default = TagIcon;