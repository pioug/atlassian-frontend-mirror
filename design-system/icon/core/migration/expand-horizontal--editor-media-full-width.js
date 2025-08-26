/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::f7e8af757eae9bbc8243694d5d6aa229>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _expandHorizontal = _interopRequireDefault(require("@atlaskit/icon/core/expand-horizontal"));
var _mediaFullWidth = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/media-full-width"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for ExpandHorizontalIcon.
 * This component is ExpandHorizontalIcon, with `UNSAFE_fallbackIcon` set to "EditorMediaFullWidthIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Single purpose - Reserved for expanding an element to its maximum width.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const ExpandHorizontalIcon = props => /*#__PURE__*/_react.default.createElement(_expandHorizontal.default, Object.assign({
  name: "ExpandHorizontalIcon",
  LEGACY_fallbackIcon: _mediaFullWidth.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
ExpandHorizontalIcon.displayName = 'ExpandHorizontalIconMigration';
var _default = exports.default = ExpandHorizontalIcon;