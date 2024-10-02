/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::077a98e35ef0cd960ccf89c3717ac609>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _compass = _interopRequireDefault(require("@atlaskit/icon/core/compass"));
var _discoverFilled = _interopRequireDefault(require("@atlaskit/icon/glyph/discover-filled"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for CompassIcon.
 * This component is CompassIcon, with `UNSAFE_fallbackIcon` set to "DiscoverFilledIcon".
 *
 * Category: multi-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Multi purpose - Known uses: templates.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const CompassIcon = props => /*#__PURE__*/_react.default.createElement(_compass.default, Object.assign({
  LEGACY_fallbackIcon: _discoverFilled.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
CompassIcon.Name = 'CompassIconMigration';
var _default = exports.default = CompassIcon;