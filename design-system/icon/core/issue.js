"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _UNSAFE_baseNew = _interopRequireDefault(require("@atlaskit/icon/UNSAFE_base-new"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are a work in progress and subject to change or removal in future minor or patch releases.
 * Please reach out in #help-design-system before using these in production.
 *
 * Icon: "Issue".
 * Category: Single-purpose
 * Location: ADS
 * Usage guidance: Reserved for issues in Jira.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const IssueIcon = props => /*#__PURE__*/_react.default.createElement(_UNSAFE_baseNew.default, Object.assign({
  dangerouslySetGlyph: `<path stroke="currentColor" stroke-linejoin="round" stroke-width="1.5" d="m5 8.25 2 2 4.5-4.75M2 13.25h12c.69 0 1.25-.56 1.25-1.25V4c0-.69-.56-1.25-1.25-1.25H2C1.31 2.75.75 3.31.75 4v8c0 .69.56 1.25 1.25 1.25Z"/>`
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
IssueIcon.displayName = 'IssueIcon';
var _default = exports.default = IssueIcon;