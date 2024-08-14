/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::fce97a5ffc39573699a9122fe4bf3d19>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _delete = _interopRequireDefault(require("@atlaskit/icon/core/delete"));
var _trash = _interopRequireDefault(require("@atlaskit/icon/glyph/trash"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for DeleteIcon.
 * This component is DeleteIcon, with `UNSAFE_fallbackIcon` set to "TrashIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Reserved for removing or deleting an object.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const DeleteIcon = props => /*#__PURE__*/_react.default.createElement(_delete.default, Object.assign({
  LEGACY_fallbackIcon: _trash.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
DeleteIcon.Name = 'DeleteIconMigration';
var _default = exports.default = DeleteIcon;