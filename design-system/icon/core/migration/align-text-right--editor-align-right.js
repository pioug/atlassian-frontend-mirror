/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::7eac815f2299367efaa07c39203dac50>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _alignTextRight = _interopRequireDefault(require("@atlaskit/icon/core/align-text-right"));
var _alignRight = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/align-right"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for AlignTextRightIcon.
 * This component is AlignTextRightIcon, with `UNSAFE_fallbackIcon` set to "EditorAlignRightIcon".
 *
 * Category: multi-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Multi purpose - Known uses: align text right, align content right.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const AlignTextRightIcon = props => /*#__PURE__*/_react.default.createElement(_alignTextRight.default, Object.assign({
  name: "AlignTextRightIcon",
  LEGACY_fallbackIcon: _alignRight.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
AlignTextRightIcon.displayName = 'AlignTextRightIconMigration';
var _default = exports.default = AlignTextRightIcon;