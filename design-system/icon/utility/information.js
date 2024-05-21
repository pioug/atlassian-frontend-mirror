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
 * Icon: "Information".
 * Category: Multi-purpose
 * Location: ADS
 * Usage guidance: Reserved for Helper Messages in Forms.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const InformationIcon = props => /*#__PURE__*/_react.default.createElement(_UNSAFE_baseNew.default, Object.assign({
  dangerouslySetGlyph: `<path fill="currentColor" fill-rule="evenodd" d="M12 6A6 6 0 1 1 0 6a6 6 0 0 1 12 0m-7.5-.75H6a.75.75 0 0 1 .75.75v4h-1.5V6.75H4.5zM6 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2" clip-rule="evenodd"/>`,
  type: 'utility'
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
InformationIcon.displayName = 'InformationIcon';
var _default = exports.default = InformationIcon;