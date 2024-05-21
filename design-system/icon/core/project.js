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
 * Icon: "Project".
 * Category: Single-purpose
 * Location: ADS
 * Usage guidance: Reserved for projects in Jira.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const ProjectIcon = props => /*#__PURE__*/_react.default.createElement(_UNSAFE_baseNew.default, Object.assign({
  dangerouslySetGlyph: `<path stroke="currentColor" stroke-linejoin="round" stroke-width="1.5" d="M1.25 10.25 3.5 8 1.25 5.75l.884-.884a1.25 1.25 0 0 1 .884-.366H7.25l2.384-2.384a1.25 1.25 0 0 1 .884-.366H13c.69 0 1.25.56 1.25 1.25v2.482c0 .332-.132.65-.366.884L11.5 8.75v4.232c0 .332-.132.65-.366.884l-.884.884L8 12.5l-2.25 2.25m-4.5 0 5-5"/><circle cx="11.375" cy="4.625" r="1.125" fill="currentColor"/>`
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
ProjectIcon.displayName = 'ProjectIcon';
var _default = exports.default = ProjectIcon;