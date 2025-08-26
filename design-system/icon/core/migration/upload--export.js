/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::89ab4c41f5117fc720387c91095ca641>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _upload = _interopRequireDefault(require("@atlaskit/icon/core/upload"));
var _export = _interopRequireDefault(require("@atlaskit/icon/glyph/export"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for UploadIcon.
 * This component is UploadIcon, with `UNSAFE_fallbackIcon` set to "ExportIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Single purpose - Reserved for upload in Editor.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const UploadIcon = props => /*#__PURE__*/_react.default.createElement(_upload.default, Object.assign({
  name: "UploadIcon",
  LEGACY_fallbackIcon: _export.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
UploadIcon.displayName = 'UploadIconMigration';
var _default = exports.default = UploadIcon;