/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::6d9d96d154eb920c24766a658bf4faef>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _iconNew = _interopRequireDefault(require("@atlaskit/icon/components/icon-new"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Icon: "Tab".
 * Category: single-purpose
 * Location: @atlaskit/icon-lab/core/tab
 * Usage guidance:
 * Reserved for representing tab key.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const TabIcon = props => /*#__PURE__*/_react.default.createElement(_iconNew.default, Object.assign({
  name: "TabIcon",
  dangerouslySetGlyph: `<path fill="currentcolor" fill-rule="evenodd" d="m7.28 3.47 4 4a.75.75 0 0 1 0 1.06l-4 4-1.06-1.06 2.72-2.72H1v-1.5h7.94L6.22 4.53zM15 3.5v9h-1.5v-9z" clip-rule="evenodd"/>`
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
TabIcon.displayName = 'TabIcon';
var _default = exports.default = TabIcon;