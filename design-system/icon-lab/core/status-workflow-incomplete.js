/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::649f33eacf8141f4fcc1b1b1681ad282>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _iconNew = _interopRequireDefault(require("@atlaskit/icon/components/icon-new"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Icon: "StatusWorkflowIncomplete".
 * Category: single-purpose
 * Location: @atlaskit/icon-lab/core/status-workflow-incomplete
 * Usage guidance:
 * Reserved for representing incomplete statuses such as "To do", "Backlog", "Not started", "Pending"
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const StatusWorkflowIncompleteIcon = props => /*#__PURE__*/_react.default.createElement(_iconNew.default, Object.assign({
  name: "StatusWorkflowIncompleteIcon",
  dangerouslySetGlyph: `<path fill="currentcolor" d="M14.5 8a6.5 6.5 0 1 0-13 0 6.5 6.5 0 0 0 13 0M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0"/>`
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
StatusWorkflowIncompleteIcon.displayName = 'StatusWorkflowIncompleteIcon';
var _default = exports.default = StatusWorkflowIncompleteIcon;