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
 * Icon: "Attachment".
 * Category: Single-purpose
 * Location: ADS
 * Usage guidance: Reserved for attaching files to issues or other objects.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const AttachmentIcon = props => /*#__PURE__*/_react.default.createElement(_UNSAFE_baseNew.default, Object.assign({
  dangerouslySetGlyph: `<path stroke="currentColor" stroke-width="1.5" d="M10.25 4.5 5.75 9a1.414 1.414 0 1 0 2 2l4.5-4.5a2.828 2.828 0 1 0-4-4L3.75 7a4.243 4.243 0 1 0 6 6l2.5-2.5"/>`
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
AttachmentIcon.displayName = 'AttachmentIcon';
var _default = exports.default = AttachmentIcon;