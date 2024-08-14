/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::015c0b82ae2c53f98d4712db5c1243d8>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _officeBuilding = _interopRequireDefault(require("@atlaskit/icon/core/office-building"));
var _officeBuilding2 = _interopRequireDefault(require("@atlaskit/icon/glyph/office-building"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for OfficeBuildingIcon.
 * This component is OfficeBuildingIcon, with `UNSAFE_fallbackIcon` set to "OfficeBuildingIcon".
 *
 * Category: multi-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Known uses: office in Atlas, company.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const OfficeBuildingIcon = props => /*#__PURE__*/_react.default.createElement(_officeBuilding.default, Object.assign({
  LEGACY_fallbackIcon: _officeBuilding2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
OfficeBuildingIcon.Name = 'OfficeBuildingIconMigration';
var _default = exports.default = OfficeBuildingIcon;