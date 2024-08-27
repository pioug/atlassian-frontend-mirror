/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::a8c9a2a27e9f3bf583de7032d81a567c>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _file = _interopRequireDefault(require("@atlaskit/icon/core/file"));
var _file2 = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/file"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for FileIcon.
 * This component is FileIcon, with `UNSAFE_fallbackIcon` set to "EditorFileIcon".
 *
 * Category: multi-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Multi purpose - Known uses: document, file. Do not use to represent a page — use the dedicated 'Page' icon instead.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const FileIcon = props => /*#__PURE__*/_react.default.createElement(_file.default, Object.assign({
  LEGACY_fallbackIcon: _file2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
FileIcon.Name = 'FileIconMigration';
var _default = exports.default = FileIcon;