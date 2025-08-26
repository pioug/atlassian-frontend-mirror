/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::3c05c142a4056afc1df3ca1d775af2e7>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _paintBucket = _interopRequireDefault(require("@atlaskit/icon/core/paint-bucket"));
var _backgroundColor = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/background-color"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for PaintBucketIcon.
 * This component is PaintBucketIcon, with `UNSAFE_fallbackIcon` set to "EditorBackgroundColorIcon".
 *
 * Category: multi-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Multi purpose - Known usages: Customize fill color.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const PaintBucketIcon = props => /*#__PURE__*/_react.default.createElement(_paintBucket.default, Object.assign({
  name: "PaintBucketIcon",
  LEGACY_fallbackIcon: _backgroundColor.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
PaintBucketIcon.displayName = 'PaintBucketIconMigration';
var _default = exports.default = PaintBucketIcon;