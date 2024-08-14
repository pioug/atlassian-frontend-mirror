/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::7e0be08318890a4932c8789281ebf917>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _location = _interopRequireDefault(require("@atlaskit/icon/core/location"));
var _location2 = _interopRequireDefault(require("@atlaskit/icon/glyph/location"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for LocationIcon.
 * This component is LocationIcon, with `UNSAFE_fallbackIcon` set to "LocationIcon".
 *
 * Category: multi-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Known uses: location in Atlas.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const LocationIcon = props => /*#__PURE__*/_react.default.createElement(_location.default, Object.assign({
  LEGACY_fallbackIcon: _location2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
LocationIcon.Name = 'LocationIconMigration';
var _default = exports.default = LocationIcon;