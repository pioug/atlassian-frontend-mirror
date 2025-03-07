/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::fde28e4aa4639b3a4377ab3dfdb022d1>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _flagFilled = _interopRequireDefault(require("@atlaskit/icon/core/flag-filled"));
var _flagFilled2 = _interopRequireDefault(require("@atlaskit/icon/glyph/flag-filled"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for FlagFilledIcon.
 * This component is FlagFilledIcon, with `UNSAFE_fallbackIcon` set to "FlagFilledIcon".
 *
 * Category: multi-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Multi purpose - Known uses: active feature flags.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const FlagFilledIcon = props => /*#__PURE__*/_react.default.createElement(_flagFilled.default, Object.assign({
  LEGACY_fallbackIcon: _flagFilled2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
FlagFilledIcon.Name = 'FlagFilledIconMigration';
var _default = exports.default = FlagFilledIcon;