"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _chevronUp = _interopRequireDefault(require("@atlaskit/icon/utility/chevron-up"));
var _chevronUp2 = _interopRequireDefault(require("@atlaskit/icon/glyph/chevron-up"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are a work in progress and subject to change or removal in future minor or patch releases.
 * Please reach out in #help-design-system before using these in production.
 *
 * Migration Icon component for ChevronUpIcon.
 * This component is ChevronUpIcon, with `UNSAFE_fallbackIcon` set to "ChevronUpIcon".
 *
 * Category: Multi-purpose
 * Location: ADS
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