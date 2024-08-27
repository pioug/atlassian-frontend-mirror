/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::699a3500a34d934c9d5f0a24a1cbcfd4>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _success = _interopRequireDefault(require("@atlaskit/icon/core/success"));
var _success2 = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/success"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for SuccessIcon.
 * This component is SuccessIcon, with `UNSAFE_fallbackIcon` set to "EditorSuccessIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Single-purpose - Reserved for success section messages and form validation messages.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const SuccessIcon = props => /*#__PURE__*/_react.default.createElement(_success.default, Object.assign({
  LEGACY_fallbackIcon: _success2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
SuccessIcon.Name = 'SuccessIconMigration';
var _default = exports.default = SuccessIcon;