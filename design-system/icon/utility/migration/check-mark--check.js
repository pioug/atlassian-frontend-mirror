"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _checkMark = _interopRequireDefault(require("@atlaskit/icon/utility/check-mark"));
var _check = _interopRequireDefault(require("@atlaskit/icon/glyph/check"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are a work in progress and subject to change or removal in future minor or patch releases.
 * Please reach out in #help-design-system before using these in production.
 *
 * Migration Icon component for CheckMarkIcon.
 * This component is CheckMarkIcon, with `UNSAFE_fallbackIcon` set to "CheckIcon".
 *
 * Category: Multi-purpose
 * Location: ADS
 * Usage guidance: TBD
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const CheckMarkIcon = props => /*#__PURE__*/_react.default.createElement(_checkMark.default, Object.assign({
  LEGACY_fallbackIcon: _check.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
CheckMarkIcon.Name = 'CheckMarkIconMigration';
var _default = exports.default = CheckMarkIcon;