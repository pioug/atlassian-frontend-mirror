"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _arrowRight = _interopRequireDefault(require("@atlaskit/icon/core/arrow-right"));
var _arrowRightCircle = _interopRequireDefault(require("@atlaskit/icon/glyph/arrow-right-circle"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are a work in progress and subject to change or removal in future minor or patch releases.
 * Please reach out in #help-design-system before using these in production.
 *
 * Migration Icon component for ArrowRightIcon.
 * This component is ArrowRightIcon, with `UNSAFE_fallbackIcon` set to "ArrowRightCircleIcon".
 *
 * Category: Multi-purpose
 * Location: ADS
 * Usage guidance: Known uses: link to nested menu item, a linked menu item, next slide.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const ArrowRightIcon = props => /*#__PURE__*/_react.default.createElement(_arrowRight.default, Object.assign({
  LEGACY_fallbackIcon: _arrowRightCircle.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
ArrowRightIcon.Name = 'ArrowRightIconMigration';
var _default = exports.default = ArrowRightIcon;