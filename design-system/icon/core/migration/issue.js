"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _issue = _interopRequireDefault(require("@atlaskit/icon/core/issue"));
var _issue2 = _interopRequireDefault(require("@atlaskit/icon/glyph/issue"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are a work in progress and subject to change or removal in future minor or patch releases.
 * Please reach out in #help-design-system before using these in production.
 *
 * Migration Icon component for IssueIcon.
 * This component is IssueIcon, with `UNSAFE_fallbackIcon` set to "IssueIcon".
 *
 * Category: Single-purpose
 * Location: ADS
 * Usage guidance: Reserved for issues in Jira.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const IssueIcon = props => /*#__PURE__*/_react.default.createElement(_issue.default, Object.assign({
  LEGACY_fallbackIcon: _issue2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
IssueIcon.Name = 'IssueIconMigration';
var _default = exports.default = IssueIcon;