/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::f94e073d76bc490a4f7b3dc7496f79e8>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _contentAlignRight = _interopRequireDefault(require("@atlaskit/icon/core/content-align-right"));
var _alignImageRight = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/align-image-right"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for ContentAlignRightIcon.
 * This component is ContentAlignRightIcon, with `UNSAFE_fallbackIcon` set to "EditorAlignImageRightIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Single purpose - Reserved for right aligning media and content.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const ContentAlignRightIcon = props => /*#__PURE__*/_react.default.createElement(_contentAlignRight.default, Object.assign({
  LEGACY_fallbackIcon: _alignImageRight.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
ContentAlignRightIcon.Name = 'ContentAlignRightIconMigration';
var _default = exports.default = ContentAlignRightIcon;