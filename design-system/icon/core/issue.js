/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::12209172c37954485ee5a5f408f5cb7b>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _baseNew = _interopRequireDefault(require("@atlaskit/icon/base-new"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 * Please reach out in #icon-contributions before using these in production.
 *
 * Icon: "Issue".
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Single purpose - Reserved for issues in Jira.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const IssueIcon = props => /*#__PURE__*/_react.default.createElement(_baseNew.default, Object.assign({
  dangerouslySetGlyph: `<path stroke="currentcolor" stroke-linejoin="round" stroke-width="1.5" d="m5 7.875 2 2.375 4-4.75m-9 7.75h12c.69 0 1.25-.56 1.25-1.25V4c0-.69-.56-1.25-1.25-1.25H2C1.31 2.75.75 3.31.75 4v8c0 .69.56 1.25 1.25 1.25Z"/>`
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
IssueIcon.displayName = 'IssueIcon';
var _default = exports.default = IssueIcon;