/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::b1c15f4189326bd2e6492a7d035d5fa7>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _layoutOneColumn = _interopRequireDefault(require("@atlaskit/icon/core/layout-one-column"));
var _layoutSingle = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/layout-single"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for LayoutOneColumnIcon.
 * This component is LayoutOneColumnIcon, with `UNSAFE_fallbackIcon` set to "EditorLayoutSingleIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Reserved for single column layout option in Confluence Editor
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const LayoutOneColumnIcon = props => /*#__PURE__*/_react.default.createElement(_layoutOneColumn.default, Object.assign({
  name: "LayoutOneColumnIcon",
  LEGACY_fallbackIcon: _layoutSingle.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
LayoutOneColumnIcon.displayName = 'LayoutOneColumnIconMigration';
var _default = exports.default = LayoutOneColumnIcon;