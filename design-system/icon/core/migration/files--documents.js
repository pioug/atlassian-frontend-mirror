/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::6dc1a5b1450546971bd4971237c7fcf0>>
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
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
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
  LEGACY_fallbackIcon: _documents.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
FilesIcon.Name = 'FilesIconMigration';
var _default = exports.default = FilesIcon;