/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::37145fcbf5ed6d8abd2e10c9ef98652f>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _contentAlignLeft = _interopRequireDefault(require("@atlaskit/icon/core/content-align-left"));
var _alignImageLeft = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/align-image-left"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for ContentAlignLeftIcon.
 * This component is ContentAlignLeftIcon, with `UNSAFE_fallbackIcon` set to "EditorAlignImageLeftIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Single purpose - Reserved for left aligning media and content.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const ContentAlignLeftIcon = props => /*#__PURE__*/_react.default.createElement(_contentAlignLeft.default, Object.assign({
  LEGACY_fallbackIcon: _alignImageLeft.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
ContentAlignLeftIcon.Name = 'ContentAlignLeftIconMigration';
var _default = exports.default = ContentAlignLeftIcon;