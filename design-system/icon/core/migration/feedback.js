/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::7923b0b29c3f4de7c1e66a726f03f5d2>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _feedback = _interopRequireDefault(require("@atlaskit/icon/core/feedback"));
var _feedback2 = _interopRequireDefault(require("@atlaskit/icon/glyph/feedback"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for FeedbackIcon.
 * This component is FeedbackIcon, with `UNSAFE_fallbackIcon` set to "FeedbackIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Single purpose - Known uses: customer feedback.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const FeedbackIcon = props => /*#__PURE__*/_react.default.createElement(_feedback.default, Object.assign({
  name: "FeedbackIcon",
  LEGACY_fallbackIcon: _feedback2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
FeedbackIcon.displayName = 'FeedbackIconMigration';
var _default = exports.default = FeedbackIcon;