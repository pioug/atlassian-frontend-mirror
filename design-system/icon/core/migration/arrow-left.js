"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _arrowLeft = _interopRequireDefault(require("@atlaskit/icon/core/arrow-left"));
var _arrowLeft2 = _interopRequireDefault(require("@atlaskit/icon/glyph/arrow-left"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are a work in progress and subject to change or removal in future minor or patch releases.
 * Please reach out in #help-design-system before using these in production.
 *
 * Migration Icon component for ArrowLeftIcon.
 * This component is ArrowLeftIcon, with `UNSAFE_fallbackIcon` set to "ArrowLeftIcon".
 *
 * Category: Multi-purpose
 * Location: ADS
 * Usage guidance: Known uses: back to previous screen, previous slide.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const ArrowLeftIcon = props => /*#__PURE__*/_react.default.createElement(_arrowLeft.default, Object.assign({
  LEGACY_fallbackIcon: _arrowLeft2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
ArrowLeftIcon.Name = 'ArrowLeftIconMigration';
var _default = exports.default = ArrowLeftIcon;