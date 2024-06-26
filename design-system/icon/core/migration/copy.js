"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _copy = _interopRequireDefault(require("@atlaskit/icon/core/copy"));
var _copy2 = _interopRequireDefault(require("@atlaskit/icon/glyph/copy"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are a work in progress and subject to change or removal in future minor or patch releases.
 * Please reach out in #help-design-system before using these in production.
 *
 * Migration Icon component for CopyIcon.
 * This component is CopyIcon, with `UNSAFE_fallbackIcon` set to "CopyIcon".
 *
 * Category: Single-purpose
 * Location: ADS
 * Usage guidance: Reserved for copying data such as text, code or other objects.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const CopyIcon = props => /*#__PURE__*/_react.default.createElement(_copy.default, Object.assign({
  LEGACY_fallbackIcon: _copy2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
CopyIcon.Name = 'CopyIconMigration';
var _default = exports.default = CopyIcon;