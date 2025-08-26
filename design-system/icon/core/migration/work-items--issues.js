/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::c76675e25829cfbc9926533b330b21aa>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _workItems = _interopRequireDefault(require("@atlaskit/icon/core/work-items"));
var _issues = _interopRequireDefault(require("@atlaskit/icon/glyph/issues"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for WorkItemsIcon.
 * This component is WorkItemsIcon, with `UNSAFE_fallbackIcon` set to "IssuesIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Reserved for representing multiple work items.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const WorkItemsIcon = props => /*#__PURE__*/_react.default.createElement(_workItems.default, Object.assign({
  name: "WorkItemsIcon",
  LEGACY_fallbackIcon: _issues.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
WorkItemsIcon.displayName = 'WorkItemsIconMigration';
var _default = exports.default = WorkItemsIcon;