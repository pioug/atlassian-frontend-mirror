/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::62cd08c81b89a9eee7393c74a6627f93>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _alignImageRight = _interopRequireDefault(require("@atlaskit/icon/core/align-image-right"));
var _alignImageRight2 = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/align-image-right"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for AlignImageRightIcon.
 * This component is AlignImageRightIcon, with `UNSAFE_fallbackIcon` set to "EditorAlignImageRightIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Single purpose - Reserved for right aligning media and content.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const AlignImageRightIcon = props => /*#__PURE__*/_react.default.createElement(_alignImageRight.default, Object.assign({
  name: "AlignImageRightIcon",
  LEGACY_fallbackIcon: _alignImageRight2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
AlignImageRightIcon.displayName = 'AlignImageRightIconMigration';
var _default = exports.default = AlignImageRightIcon;