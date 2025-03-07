/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::48def302f1b2da7a891405cd3110996b>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _alignRight = _interopRequireDefault(require("@atlaskit/icon/core/align-right"));
var _alignRight2 = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/align-right"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for AlignRightIcon.
 * This component is AlignRightIcon, with `UNSAFE_fallbackIcon` set to "EditorAlignRightIcon".
 *
 * Category: multi-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Multi purpose - Known uses: align text right, align content right.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const AlignRightIcon = props => /*#__PURE__*/_react.default.createElement(_alignRight.default, Object.assign({
  LEGACY_fallbackIcon: _alignRight2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
AlignRightIcon.Name = 'AlignRightIconMigration';
var _default = exports.default = AlignRightIcon;