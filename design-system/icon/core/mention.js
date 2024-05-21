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
 * Icon: "Mention".
 * Category: Single-purpose
 * Location: Icon contributions
 * Usage guidance: Reserved for user mentions.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const MentionIcon = props => /*#__PURE__*/_react.default.createElement(_UNSAFE_baseNew.default, Object.assign({
  dangerouslySetGlyph: `<path stroke="currentColor" stroke-linecap="square" stroke-width="1.5" d="M11.625 14.28A7.25 7.25 0 1 1 15.25 8c0 1.381-.932 3.107-2.59 3.107-1.656 0-1.782-1.976-1.782-3.357l.005-.125m0 0c.022-1.019-.42-1.956-1.258-2.44-1.315-.759-3.11-.114-4.007 1.44s-.558 3.43.757 4.19c1.315.759 3.11.115 4.007-1.44a3.7 3.7 0 0 0 .5-1.75Z"/>`
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
MentionIcon.displayName = 'MentionIcon';
var _default = exports.default = MentionIcon;