/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::e77d274563a7d744facd9e5201e6c48b>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _chevronUp = _interopRequireDefault(require("@atlaskit/icon/utility/chevron-up"));
var _chevronUp2 = _interopRequireDefault(require("@atlaskit/icon/glyph/hipchat/chevron-up"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for ChevronUpIcon.
 * This component is ChevronUpIcon, with `UNSAFE_fallbackIcon` set to "HipchatChevronUpIcon".
 *
 * Category: utility
 * Location: @atlaskit/icon
 * Usage guidance: Reserved for accordions.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const ChevronUpIcon = props => /*#__PURE__*/_react.default.createElement(_chevronUp.default, Object.assign({
  LEGACY_fallbackIcon: _chevronUp2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
ChevronUpIcon.Name = 'ChevronUpIconMigration';
var _default = exports.default = ChevronUpIcon;