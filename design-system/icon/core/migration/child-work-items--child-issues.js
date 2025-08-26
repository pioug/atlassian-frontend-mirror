/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::b82dc15082282daee763437940a95e2e>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _childWorkItems = _interopRequireDefault(require("@atlaskit/icon/core/child-work-items"));
var _childIssues = _interopRequireDefault(require("@atlaskit/icon/glyph/child-issues"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for ChildWorkItemsIcon.
 * This component is ChildWorkItemsIcon, with `UNSAFE_fallbackIcon` set to "ChildIssuesIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Reserved for child work items.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const ChildWorkItemsIcon = props => /*#__PURE__*/_react.default.createElement(_childWorkItems.default, Object.assign({
  name: "ChildWorkItemsIcon",
  LEGACY_fallbackIcon: _childIssues.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
ChildWorkItemsIcon.displayName = 'ChildWorkItemsIconMigration';
var _default = exports.default = ChildWorkItemsIcon;