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
 * Icon: "Minimize".
 * Category: Single-purpose
 * Location: ADS
 * Usage guidance: Known uses: minimize modal window, minimize panel, minimize video screen.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const MinimizeIcon = props => /*#__PURE__*/_react.default.createElement(_UNSAFE_baseNew.default, Object.assign({
  dangerouslySetGlyph: `<path stroke="currentColor" stroke-linejoin="round" stroke-width="1.5" d="m1.5 14.5 5.25-5.25M14.5 1.5 9.25 6.75M6.75 14V9.25H2M9.25 2v4.75H14"/>`
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
MinimizeIcon.displayName = 'MinimizeIcon';
var _default = exports.default = MinimizeIcon;