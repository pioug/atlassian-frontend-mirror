/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::1e8917d3a5aac4b99b0f55b24958842a>>
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
 * Usage guidance: Reserved for reloading content.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const RefreshIcon = props => /*#__PURE__*/_react.default.createElement(_refresh.default, Object.assign({
  LEGACY_fallbackIcon: _refresh2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
RefreshIcon.Name = 'RefreshIconMigration';
var _default = exports.default = RefreshIcon;