/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::88ba20151931ba3bc3acff79a5d761b1>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _folderClosed = _interopRequireDefault(require("@atlaskit/icon/core/folder-closed"));
var _folder = _interopRequireDefault(require("@atlaskit/icon/glyph/folder"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for FolderClosedIcon.
 * This component is FolderClosedIcon, with `UNSAFE_fallbackIcon` set to "FolderIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Single purpose - Reserved for folders in Confluence.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const FolderClosedIcon = props => /*#__PURE__*/_react.default.createElement(_folderClosed.default, Object.assign({
  name: "FolderClosedIcon",
  LEGACY_fallbackIcon: _folder.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
FolderClosedIcon.displayName = 'FolderClosedIconMigration';
var _default = exports.default = FolderClosedIcon;