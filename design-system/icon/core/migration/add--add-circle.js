/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::274a3d745c0c6824dba97f9232f7df06>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _add = _interopRequireDefault(require("@atlaskit/icon/core/add"));
var _addCircle = _interopRequireDefault(require("@atlaskit/icon/glyph/add-circle"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for AddIcon.
 * This component is AddIcon, with `UNSAFE_fallbackIcon` set to "AddCircleIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Single purpose - Reserved for creating and adding an object.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const AddIcon = props => /*#__PURE__*/_react.default.createElement(_add.default, Object.assign({
  LEGACY_fallbackIcon: _addCircle.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
AddIcon.Name = 'AddIconMigration';
var _default = exports.default = AddIcon;