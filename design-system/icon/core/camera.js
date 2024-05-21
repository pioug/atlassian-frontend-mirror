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
 * Icon: "Camera".
 * Category: Multi-purpose
 * Location: Icon contributions
 * Usage guidance: Known uses: upload photo in Trello, photos.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const CameraIcon = props => /*#__PURE__*/_react.default.createElement(_UNSAFE_baseNew.default, Object.assign({
  dangerouslySetGlyph: `<path stroke="currentColor" stroke-linejoin="round" stroke-width="1.5" d="M14 13.25H2c-.69 0-1.25-.56-1.25-1.25V5.25a2 2 0 0 1 2-2H4.5l1.5-2h4l1.5 2h1.75a2 2 0 0 1 2 2V12c0 .69-.56 1.25-1.25 1.25Z"/><path stroke="currentColor" stroke-linejoin="round" stroke-width="1.5" d="M10.5 8.25a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"/>`
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
CameraIcon.displayName = 'CameraIcon';
var _default = exports.default = CameraIcon;