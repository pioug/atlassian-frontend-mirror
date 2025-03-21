/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::d345d1980a5e7ce7680063890c36f7e3>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _success = _interopRequireDefault(require("@atlaskit/icon/utility/success"));
var _success2 = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/success"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for SuccessIcon.
 * This component is SuccessIcon, with `UNSAFE_fallbackIcon` set to "EditorSuccessIcon".
 *
 * Category: utility
 * Location: @atlaskit/icon
 * Usage guidance: Reserved for Helper Messages in Forms.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const SuccessIcon = props => /*#__PURE__*/_react.default.createElement(_success.default, Object.assign({
  LEGACY_fallbackIcon: _success2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
SuccessIcon.Name = 'SuccessIconMigration';
var _default = exports.default = SuccessIcon;