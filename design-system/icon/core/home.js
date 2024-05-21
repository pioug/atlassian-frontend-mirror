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
 * Icon: "Home".
 * Category: Single-purpose
 * Location: ADS
 * Usage guidance: Reserved for home in navigation. When a user clicks on this, they should return to the homepage.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const HomeIcon = props => /*#__PURE__*/_react.default.createElement(_UNSAFE_baseNew.default, Object.assign({
  dangerouslySetGlyph: `<path stroke="currentColor" stroke-linejoin="round" stroke-width="1.5" d="M6.25 14.25H3c-.69 0-1.25-.56-1.25-1.25V6.799c0-.35.146-.684.404-.92l5-4.6a1.25 1.25 0 0 1 1.692 0l5 4.6c.258.236.404.57.404.92V13c0 .69-.56 1.25-1.25 1.25H9.75v-5.5h-3.5z"/>`
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
HomeIcon.displayName = 'HomeIcon';
var _default = exports.default = HomeIcon;