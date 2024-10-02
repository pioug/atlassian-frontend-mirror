/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::1e26d173739b42840362bf02b1191efb>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _radioUnchecked = _interopRequireDefault(require("@atlaskit/icon/core/radio-unchecked"));
var _preselected = _interopRequireDefault(require("@atlaskit/icon/glyph/media-services/preselected"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for RadioUncheckedIcon.
 * This component is RadioUncheckedIcon, with `UNSAFE_fallbackIcon` set to "MediaServicesPreselectedIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Reserved for the unselected state of radio controls.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const RadioUncheckedIcon = props => /*#__PURE__*/_react.default.createElement(_radioUnchecked.default, Object.assign({
  LEGACY_fallbackIcon: _preselected.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
RadioUncheckedIcon.Name = 'RadioUncheckedIconMigration';
var _default = exports.default = RadioUncheckedIcon;