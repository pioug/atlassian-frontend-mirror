"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _issues = _interopRequireDefault(require("@atlaskit/icon/core/issues"));
var _issues2 = _interopRequireDefault(require("@atlaskit/icon/glyph/issues"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are a work in progress and subject to change or removal in future minor or patch releases.
 * Please reach out in #help-design-system before using these in production.
 *
 * Migration Icon component for IssuesIcon.
 * This component is IssuesIcon, with `UNSAFE_fallbackIcon` set to "IssuesIcon".
 *
 * Category: Single-purpose
 * Location: ADS
 * Usage guidance: Reserved for multiple issues in Jira.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const IssuesIcon = props => /*#__PURE__*/_react.default.createElement(_issues.default, Object.assign({
  LEGACY_fallbackIcon: _issues2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
IssuesIcon.Name = 'IssuesIconMigration';
var _default = exports.default = IssuesIcon;