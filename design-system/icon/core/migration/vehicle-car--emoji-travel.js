/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::f76d0e806393dd94f10e2f2411eaa2cf>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _vehicleCar = _interopRequireDefault(require("@atlaskit/icon/core/vehicle-car"));
var _travel = _interopRequireDefault(require("@atlaskit/icon/glyph/emoji/travel"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for VehicleCarIcon.
 * This component is VehicleCarIcon, with `UNSAFE_fallbackIcon` set to "EmojiTravelIcon".
 *
 * Category: multi-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Multi purpose - Known usages: Transport emoji category.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const VehicleCarIcon = props => /*#__PURE__*/_react.default.createElement(_vehicleCar.default, Object.assign({
  name: "VehicleCarIcon",
  LEGACY_fallbackIcon: _travel.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
VehicleCarIcon.displayName = 'VehicleCarIconMigration';
var _default = exports.default = VehicleCarIcon;