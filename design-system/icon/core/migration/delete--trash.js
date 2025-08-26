/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::99109ffa7b321731c8b8daa4a9fae9cc>>
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
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for DeleteIcon.
 * This component is DeleteIcon, with `UNSAFE_fallbackIcon` set to "TrashIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Single purpose - Reserved for removing or deleting an object.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const DeleteIcon = props => /*#__PURE__*/_react.default.createElement(_delete.default, Object.assign({
  name: "DeleteIcon",
  LEGACY_fallbackIcon: _trash.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
DeleteIcon.displayName = 'DeleteIconMigration';
var _default = exports.default = DeleteIcon;