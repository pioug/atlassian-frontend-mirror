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
 * Icon: "LinkExternal".
 * Category: Multi-purpose
 * Location: ADS
 * Usage guidance: Reserved for links that open up a new tab as a secondary/tertiary action.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const LinkExternalIcon = props => /*#__PURE__*/_react.default.createElement(_UNSAFE_baseNew.default, Object.assign({
  dangerouslySetGlyph: `<path stroke="currentColor" stroke-linejoin="round" stroke-width="1.5" d="M10.25 6.25v-4.5h-4.5m-2.25 0h-.81a.94.94 0 0 0-.94.94v6.62c0 .52.42.94.94.94h6.62c.52 0 .94-.42.94-.94V8.5M5 7l5.25-5.25"/>`,
  type: 'utility'
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
LinkExternalIcon.displayName = 'LinkExternalIcon';
var _default = exports.default = LinkExternalIcon;