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
 * Icon: "Whiteboard".
 * Category: Single-purpose
 * Location: ADS
 * Usage guidance: Reserved for whiteboards in Confluence.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const WhiteboardIcon = props => /*#__PURE__*/_react.default.createElement(_UNSAFE_baseNew.default, Object.assign({
  dangerouslySetGlyph: `<path stroke="currentColor" stroke-linejoin="round" stroke-width="1.5" d="M7 3.284C7.52 1.68 10.122.61 11.163 1.68c1.84 1.89-4.659 4.45-.52 3.742 3.122-.535 4.527 1.44 2.966 3.578M6.75 7.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3.5 1.5-3 5h6z"/>`
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
WhiteboardIcon.displayName = 'WhiteboardIcon';
var _default = exports.default = WhiteboardIcon;