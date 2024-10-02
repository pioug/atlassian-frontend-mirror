/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::02f6a0e441df795f021392b29400bade>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _page = _interopRequireDefault(require("@atlaskit/icon/core/page"));
var _documentFilled = _interopRequireDefault(require("@atlaskit/icon/glyph/document-filled"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for PageIcon.
 * This component is PageIcon, with `UNSAFE_fallbackIcon` set to "DocumentFilledIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Single purpose - Reserved for pages in Confluence.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const PageIcon = props => /*#__PURE__*/_react.default.createElement(_page.default, Object.assign({
  LEGACY_fallbackIcon: _documentFilled.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
PageIcon.Name = 'PageIconMigration';
var _default = exports.default = PageIcon;