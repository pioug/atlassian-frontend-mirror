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
 * Icon: "Person".
 * Category: Single-purpose
 * Location: ADS
 * Usage guidance: Known uses: representing a person or user, owner, contributor.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const PersonIcon = props => /*#__PURE__*/_react.default.createElement(_UNSAFE_baseNew.default, Object.assign({
  dangerouslySetGlyph: `<path stroke="currentColor" stroke-linejoin="round" stroke-width="1.5" d="M13.25 16v-3a3 3 0 0 0-3-3h-4.5a3 3 0 0 0-3 3v3m8.5-12a3.25 3.25 0 1 1-6.5 0 3.25 3.25 0 0 1 6.5 0Z"/>`
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
PersonIcon.displayName = 'PersonIcon';
var _default = exports.default = PersonIcon;