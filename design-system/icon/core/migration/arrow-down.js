"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _arrowDown = _interopRequireDefault(require("@atlaskit/icon/core/arrow-down"));
var _arrowDown2 = _interopRequireDefault(require("@atlaskit/icon/glyph/arrow-down"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are a work in progress and subject to change or removal in future minor or patch releases.
 * Please reach out in #help-design-system before using these in production.
 *
 * Migration Icon component for ArrowDownIcon.
 * This component is ArrowDownIcon, with `UNSAFE_fallbackIcon` set to "ArrowDownIcon".
 *
 * Category: Multi-purpose
 * Location: ADS
 * Usage guidance: Know uses: sorting table headers or Bitbucket code difference.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const ArrowDownIcon = props => /*#__PURE__*/_react.default.createElement(_arrowDown.default, Object.assign({
  LEGACY_fallbackIcon: _arrowDown2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
ArrowDownIcon.Name = 'ArrowDownIconMigration';
var _default = exports.default = ArrowDownIcon;