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
 * Icon: "Download".
 * Category: Single-purpose
 * Location: ADS
 * Usage guidance: Reserved for file downloads.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const DownloadIcon = props => /*#__PURE__*/_react.default.createElement(_UNSAFE_baseNew.default, Object.assign({
  dangerouslySetGlyph: `<path stroke="currentColor" stroke-linejoin="round" stroke-width="1.5" d="M1.75 9v4c0 .69.56 1.25 1.25 1.25h10c.69 0 1.25-.56 1.25-1.25V9M8 10.25V1"/><path stroke="currentColor" stroke-linejoin="round" stroke-width="1.5" d="m4 6.25 4 4 4-4"/>`
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
DownloadIcon.displayName = 'DownloadIcon';
var _default = exports.default = DownloadIcon;