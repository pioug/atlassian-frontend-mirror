/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::e77e094a0aa1d7ca1d4c9b1f496feee5>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _refresh = _interopRequireDefault(require("@atlaskit/icon/core/refresh"));
var _refresh2 = _interopRequireDefault(require("@atlaskit/icon/glyph/refresh"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for RefreshIcon.
 * This component is RefreshIcon, with `UNSAFE_fallbackIcon` set to "RefreshIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Single purpose - Reserved for expanding a object or panel.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const RefreshIcon = props => /*#__PURE__*/_react.default.createElement(_refresh.default, Object.assign({
  LEGACY_fallbackIcon: _refresh2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
RefreshIcon.Name = 'RefreshIconMigration';
var _default = exports.default = RefreshIcon;