"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _starStarred = _interopRequireDefault(require("@atlaskit/icon/core/star-starred"));
var _starFilled = _interopRequireDefault(require("@atlaskit/icon/glyph/star-filled"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are a work in progress and subject to change or removal in future minor or patch releases.
 * Please reach out in #help-design-system before using these in production.
 *
 * Migration Icon component for StarStarredIcon.
 * This component is StarStarredIcon, with `UNSAFE_fallbackIcon` set to "StarFilledIcon".
 *
 * Category: Single-purpose
 * Location: ADS
 * Usage guidance: Reserved for starred or favourited objects.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const StarStarredIcon = props => /*#__PURE__*/_react.default.createElement(_starStarred.default, Object.assign({
  LEGACY_fallbackIcon: _starFilled.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
StarStarredIcon.Name = 'StarStarredIconMigration';
var _default = exports.default = StarStarredIcon;