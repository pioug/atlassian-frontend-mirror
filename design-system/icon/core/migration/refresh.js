/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::719d4261fb56656c74a1b6271d6f07b3>>
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
 * Migration Icon component for RefreshIcon.
 * This component is RefreshIcon, with `UNSAFE_fallbackIcon` set to "RefreshIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Reserved for reloading or replaying content
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const RefreshIcon = props => /*#__PURE__*/_react.default.createElement(_refresh.default, Object.assign({
  name: "RefreshIcon",
  LEGACY_fallbackIcon: _refresh2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
RefreshIcon.displayName = 'RefreshIconMigration';
var _default = exports.default = RefreshIcon;