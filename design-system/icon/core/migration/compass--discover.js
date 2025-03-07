/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::e4278cede1b75ce1f6bae493dae404a5>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _compass = _interopRequireDefault(require("@atlaskit/icon/core/compass"));
var _discover = _interopRequireDefault(require("@atlaskit/icon/glyph/discover"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for CompassIcon.
 * This component is CompassIcon, with `UNSAFE_fallbackIcon` set to "DiscoverIcon".
 *
 * Category: multi-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Multi purpose - Known uses: templates.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const CompassIcon = props => /*#__PURE__*/_react.default.createElement(_compass.default, Object.assign({
  LEGACY_fallbackIcon: _discover.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
CompassIcon.Name = 'CompassIconMigration';
var _default = exports.default = CompassIcon;