/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::9df4d40f62ee15fbe7a868894c640f4f>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _page = _interopRequireDefault(require("@atlaskit/icon/core/page"));
var _pageFilled = _interopRequireDefault(require("@atlaskit/icon/glyph/page-filled"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for PageIcon.
 * This component is PageIcon, with `UNSAFE_fallbackIcon` set to "PageFilledIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Reserved for pages in Confluence.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const PageIcon = props => /*#__PURE__*/_react.default.createElement(_page.default, Object.assign({
  LEGACY_fallbackIcon: _pageFilled.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
PageIcon.Name = 'PageIconMigration';
var _default = exports.default = PageIcon;