/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::32b30012a06b05f4ef4342e1d9ce4358>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _feedback = _interopRequireDefault(require("@atlaskit/icon/core/feedback"));
var _feedback2 = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/feedback"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for FeedbackIcon.
 * This component is FeedbackIcon, with `UNSAFE_fallbackIcon` set to "EditorFeedbackIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Single purpose - Known uses: customer feedback.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const FeedbackIcon = props => /*#__PURE__*/_react.default.createElement(_feedback.default, Object.assign({
  LEGACY_fallbackIcon: _feedback2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
FeedbackIcon.Name = 'FeedbackIconMigration';
var _default = exports.default = FeedbackIcon;