/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::2dddaecdf5dff9e9b72ef37cd9d8f5ea>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _chevronDown = _interopRequireDefault(require("@atlaskit/icon/utility/chevron-down"));
var _chevronDown2 = _interopRequireDefault(require("@atlaskit/icon/glyph/hipchat/chevron-down"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for ChevronDownIcon.
 * This component is ChevronDownIcon, with `UNSAFE_fallbackIcon` set to "HipchatChevronDownIcon".
 *
 * Category: utility
 * Location: @atlaskit/icon
 * Usage guidance: Reserved for dropdown menus, selects, accordions, and expands.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const ChevronDownIcon = props => /*#__PURE__*/_react.default.createElement(_chevronDown.default, Object.assign({
  LEGACY_fallbackIcon: _chevronDown2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
ChevronDownIcon.Name = 'ChevronDownIconMigration';
var _default = exports.default = ChevronDownIcon;