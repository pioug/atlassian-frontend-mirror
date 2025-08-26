/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::9419ecdfb4b77a50be6fb889f9640b0d>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _files = _interopRequireDefault(require("@atlaskit/icon/core/files"));
var _documents = _interopRequireDefault(require("@atlaskit/icon/glyph/documents"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for FilesIcon.
 * This component is FilesIcon, with `UNSAFE_fallbackIcon` set to "DocumentsIcon".
 *
 * Category: multi-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Multi purpose - Known uses: documents, files. Do not use to represent pages — use the dedicated 'Pages' icon instead.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const FilesIcon = props => /*#__PURE__*/_react.default.createElement(_files.default, Object.assign({
  name: "FilesIcon",
  LEGACY_fallbackIcon: _documents.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
FilesIcon.displayName = 'FilesIconMigration';
var _default = exports.default = FilesIcon;