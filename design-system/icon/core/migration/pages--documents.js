/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::a85c6be400697565659a0d5106ebddfb>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _pages = _interopRequireDefault(require("@atlaskit/icon/core/pages"));
var _documents = _interopRequireDefault(require("@atlaskit/icon/glyph/documents"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for PagesIcon.
 * This component is PagesIcon, with `UNSAFE_fallbackIcon` set to "DocumentsIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Single purpose - Reserved for multipe pages in Confluence.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const PagesIcon = props => /*#__PURE__*/_react.default.createElement(_pages.default, Object.assign({
  name: "PagesIcon",
  LEGACY_fallbackIcon: _documents.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
PagesIcon.displayName = 'PagesIconMigration';
var _default = exports.default = PagesIcon;