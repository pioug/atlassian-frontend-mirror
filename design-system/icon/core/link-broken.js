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
 * Icon: "LinkBroken".
 * Category: Single-purpose
 * Location: ADS
 * Usage guidance: Reserved for removing a link.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const LinkBrokenIcon = props => /*#__PURE__*/_react.default.createElement(_UNSAFE_baseNew.default, Object.assign({
  dangerouslySetGlyph: `<path stroke="currentColor" stroke-linejoin="round" stroke-width="1.5" d="m3.5 8-.75.75a3.182 3.182 0 0 0 4.5 4.5L8 12.5m0-9 .75-.75a3.182 3.182 0 0 1 4.5 4.5L12.5 8M5.25 2v3.25H2m12 5.5h-3.25V14"/>`
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
LinkBrokenIcon.displayName = 'LinkBrokenIcon';
var _default = exports.default = LinkBrokenIcon;