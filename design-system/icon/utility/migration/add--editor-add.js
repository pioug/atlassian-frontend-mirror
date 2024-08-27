/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::aeb8e9a885c7b2d92b8e0a5c972b995e>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _add = _interopRequireDefault(require("@atlaskit/icon/utility/add"));
var _add2 = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/add"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for AddIcon.
 * This component is AddIcon, with `UNSAFE_fallbackIcon` set to "EditorAddIcon".
 *
 * Category: utility
 * Location: @atlaskit/icon
 * Usage guidance: Reserved for creating and adding an object as a secondary/tertiary action in a menu item.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const AddIcon = props => /*#__PURE__*/_react.default.createElement(_add.default, Object.assign({
  LEGACY_fallbackIcon: _add2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
AddIcon.Name = 'AddIconMigration';
var _default = exports.default = AddIcon;