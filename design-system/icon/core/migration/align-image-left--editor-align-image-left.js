/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::4f67a8e22aeb5981f495ee8ba248efe9>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _alignImageLeft = _interopRequireDefault(require("@atlaskit/icon/core/align-image-left"));
var _alignImageLeft2 = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/align-image-left"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for AlignImageLeftIcon.
 * This component is AlignImageLeftIcon, with `UNSAFE_fallbackIcon` set to "EditorAlignImageLeftIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Single purpose - Reserved for left aligning media and content.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const AlignImageLeftIcon = props => /*#__PURE__*/_react.default.createElement(_alignImageLeft.default, Object.assign({
  name: "AlignImageLeftIcon",
  LEGACY_fallbackIcon: _alignImageLeft2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
AlignImageLeftIcon.displayName = 'AlignImageLeftIconMigration';
var _default = exports.default = AlignImageLeftIcon;