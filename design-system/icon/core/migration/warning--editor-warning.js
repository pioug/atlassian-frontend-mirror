/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::b730934f2bce5dfa2df636ed5a6b60cf>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _warning = _interopRequireDefault(require("@atlaskit/icon/core/warning"));
var _warning2 = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/warning"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for WarningIcon.
 * This component is WarningIcon, with `UNSAFE_fallbackIcon` set to "EditorWarningIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Reserved for warning system status.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const WarningIcon = props => /*#__PURE__*/_react.default.createElement(_warning.default, Object.assign({
  LEGACY_fallbackIcon: _warning2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
WarningIcon.Name = 'WarningIconMigration';
var _default = exports.default = WarningIcon;