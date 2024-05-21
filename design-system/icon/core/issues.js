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
 * Icon: "Issues".
 * Category: Single-purpose
 * Location: ADS
 * Usage guidance: Reserved for multiple issues in Jira.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const IssuesIcon = props => /*#__PURE__*/_react.default.createElement(_UNSAFE_baseNew.default, Object.assign({
  dangerouslySetGlyph: `<path stroke="currentColor" stroke-linejoin="round" stroke-width="1.5" d="m3.875 7 1.75 1.75L9.125 5M.75 10V4c0-.69.56-1.25 1.25-1.25h9c.69 0 1.25.56 1.25 1.25v6c0 .69-.56 1.25-1.25 1.25H2c-.69 0-1.25-.56-1.25-1.25Z"/><path stroke="currentColor" stroke-width="1.5" d="M5 14.25h7.75a2.5 2.5 0 0 0 2.5-2.5V7"/>`
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
IssuesIcon.displayName = 'IssuesIcon';
var _default = exports.default = IssuesIcon;