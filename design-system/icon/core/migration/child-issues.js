"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _childIssues = _interopRequireDefault(require("@atlaskit/icon/core/child-issues"));
var _childIssues2 = _interopRequireDefault(require("@atlaskit/icon/glyph/child-issues"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are a work in progress and subject to change or removal in future minor or patch releases.
 * Please reach out in #help-design-system before using these in production.
 *
 * Migration Icon component for ChildIssuesIcon.
 * This component is ChildIssuesIcon, with `UNSAFE_fallbackIcon` set to "ChildIssuesIcon".
 *
 * Category: Single-purpose
 * Location: Icon contributions
 * Usage guidance: Reserved for child issues in Jira.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const ChildIssuesIcon = props => /*#__PURE__*/_react.default.createElement(_childIssues.default, Object.assign({
  LEGACY_fallbackIcon: _childIssues2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
ChildIssuesIcon.Name = 'ChildIssuesIconMigration';
var _default = exports.default = ChildIssuesIcon;