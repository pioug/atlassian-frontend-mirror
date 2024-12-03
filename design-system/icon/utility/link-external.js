/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::04027a0ddb99a55de232af679ba77808>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _baseNew = _interopRequireDefault(require("@atlaskit/icon/base-new"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 * Please reach out in #icon-contributions before using these in production.
 *
 * Icon: "LinkExternal".
 * Category: utility
 * Location: @atlaskit/icon
 * Usage guidance: Reserved for links that open up a new tab as a secondary/tertiary action.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const LinkExternalIcon = props => /*#__PURE__*/_react.default.createElement(_baseNew.default, Object.assign({
  dangerouslySetGlyph: `<path stroke="currentcolor" stroke-linejoin="round" stroke-width="1.5" d="M3.5 1.75h-.812a.937.937 0 0 0-.938.938v6.624c0 .518.42.938.938.938h6.624c.518 0 .938-.42.938-.937V8.5M5 7l4.75-4.75m.5 4v-4.5h-4.5"/>`,
  type: 'utility'
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
LinkExternalIcon.displayName = 'LinkExternalIcon';
var _default = exports.default = LinkExternalIcon;