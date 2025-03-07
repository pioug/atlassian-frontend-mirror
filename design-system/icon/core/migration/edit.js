/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::631c9d525a923bb24b78f7aa2d70d92c>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _edit = _interopRequireDefault(require("@atlaskit/icon/core/edit"));
var _edit2 = _interopRequireDefault(require("@atlaskit/icon/glyph/edit"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for EditIcon.
 * This component is EditIcon, with `UNSAFE_fallbackIcon` set to "EditIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Single purpose - Reserved for editing objects.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const EditIcon = props => /*#__PURE__*/_react.default.createElement(_edit.default, Object.assign({
  LEGACY_fallbackIcon: _edit2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
EditIcon.Name = 'EditIconMigration';
var _default = exports.default = EditIcon;