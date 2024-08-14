/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::3b1fc7e3ef8489150afb961fe3efa5a8>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _chevronRight = _interopRequireDefault(require("@atlaskit/icon/utility/chevron-right"));
var _chevronRight2 = _interopRequireDefault(require("@atlaskit/icon/glyph/chevron-right"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for ChevronRightIcon.
 * This component is ChevronRightIcon, with `UNSAFE_fallbackIcon` set to "ChevronRightIcon".
 *
 * Category: utility
 * Location: @atlaskit/icon
 * Usage guidance: Reserved for menu fly-outs and to indicate next in dates.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const ChevronRightIcon = props => /*#__PURE__*/_react.default.createElement(_chevronRight.default, Object.assign({
  LEGACY_fallbackIcon: _chevronRight2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
ChevronRightIcon.Name = 'ChevronRightIconMigration';
var _default = exports.default = ChevronRightIcon;