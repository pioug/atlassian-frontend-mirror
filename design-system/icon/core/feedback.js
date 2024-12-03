/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::cdeb4e8fedeb21cdc8d38f736eb852b2>>
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
 * Icon: "Feedback".
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Single purpose - Known uses: customer feedback.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const FeedbackIcon = props => /*#__PURE__*/_react.default.createElement(_baseNew.default, Object.assign({
  dangerouslySetGlyph: `<path stroke="currentcolor" stroke-linejoin="round" stroke-width="1.5" d="M1.75 9.5V15L6 12.25h7c.69 0 1.25-.56 1.25-1.25V3c0-.69-.56-1.25-1.25-1.25H3c-.69 0-1.25.56-1.25 1.25v2.75C1.75 6.44 2.31 7 3 7h6.75m-2-2.5 2.5 2.5-2.5 2.5"/>`
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
FeedbackIcon.displayName = 'FeedbackIcon';
var _default = exports.default = FeedbackIcon;