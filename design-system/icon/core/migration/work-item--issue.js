/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::2e92e16a955e77467ae474503d43ab87>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _workItem = _interopRequireDefault(require("@atlaskit/icon/core/work-item"));
var _issue = _interopRequireDefault(require("@atlaskit/icon/glyph/issue"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for WorkItemIcon.
 * This component is WorkItemIcon, with `UNSAFE_fallbackIcon` set to "IssueIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Reserved for work items.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const WorkItemIcon = props => /*#__PURE__*/_react.default.createElement(_workItem.default, Object.assign({
  name: "WorkItemIcon",
  LEGACY_fallbackIcon: _issue.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
WorkItemIcon.displayName = 'WorkItemIconMigration';
var _default = exports.default = WorkItemIcon;