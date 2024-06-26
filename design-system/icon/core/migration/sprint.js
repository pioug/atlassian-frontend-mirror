"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _sprint = _interopRequireDefault(require("@atlaskit/icon/core/sprint"));
var _sprint2 = _interopRequireDefault(require("@atlaskit/icon/glyph/sprint"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are a work in progress and subject to change or removal in future minor or patch releases.
 * Please reach out in #help-design-system before using these in production.
 *
 * Migration Icon component for SprintIcon.
 * This component is SprintIcon, with `UNSAFE_fallbackIcon` set to "SprintIcon".
 *
 * Category: Single-purpose
 * Location: ADS
 * Usage guidance: Reserved for sprints in Jira.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const SprintIcon = props => /*#__PURE__*/_react.default.createElement(_sprint.default, Object.assign({
  LEGACY_fallbackIcon: _sprint2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
SprintIcon.Name = 'SprintIconMigration';
var _default = exports.default = SprintIcon;