/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::2c8fde928c3d00c6ed02e51781702744>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _chevronLeft = _interopRequireDefault(require("@atlaskit/icon/utility/chevron-left"));
var _chevronLeftLarge = _interopRequireDefault(require("@atlaskit/icon/glyph/chevron-left-large"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for ChevronLeftIcon.
 * This component is ChevronLeftIcon, with `UNSAFE_fallbackIcon` set to "ChevronLeftLargeIcon".
 *
 * Category: utility
 * Location: @atlaskit/icon
 * Usage guidance: Reserved for collapse side nav and to indicate previous in dates.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const ChevronLeftIcon = props => /*#__PURE__*/_react.default.createElement(_chevronLeft.default, Object.assign({
  LEGACY_fallbackIcon: _chevronLeftLarge.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
ChevronLeftIcon.Name = 'ChevronLeftIconMigration';
var _default = exports.default = ChevronLeftIcon;