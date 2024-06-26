"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _release = _interopRequireDefault(require("@atlaskit/icon/core/release"));
var _ship = _interopRequireDefault(require("@atlaskit/icon/glyph/ship"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are a work in progress and subject to change or removal in future minor or patch releases.
 * Please reach out in #help-design-system before using these in production.
 *
 * Migration Icon component for ReleaseIcon.
 * This component is ReleaseIcon, with `UNSAFE_fallbackIcon` set to "ShipIcon".
 *
 * Category: Single-purpose
 * Location: Icon contributions
 * Usage guidance: Reserved for releases in Jira.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const ReleaseIcon = props => /*#__PURE__*/_react.default.createElement(_release.default, Object.assign({
  LEGACY_fallbackIcon: _ship.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
ReleaseIcon.Name = 'ReleaseIconMigration';
var _default = exports.default = ReleaseIcon;