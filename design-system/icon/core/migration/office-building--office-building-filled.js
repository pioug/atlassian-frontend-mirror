/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::256a7838c06b0fb117b2e3d975619c3e>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _officeBuilding = _interopRequireDefault(require("@atlaskit/icon/core/office-building"));
var _officeBuildingFilled = _interopRequireDefault(require("@atlaskit/icon/glyph/office-building-filled"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for OfficeBuildingIcon.
 * This component is OfficeBuildingIcon, with `UNSAFE_fallbackIcon` set to "OfficeBuildingFilledIcon".
 *
 * Category: multi-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Multi purpose - Known uses: office in Atlas, company.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const OfficeBuildingIcon = props => /*#__PURE__*/_react.default.createElement(_officeBuilding.default, Object.assign({
  LEGACY_fallbackIcon: _officeBuildingFilled.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
OfficeBuildingIcon.Name = 'OfficeBuildingIconMigration';
var _default = exports.default = OfficeBuildingIcon;