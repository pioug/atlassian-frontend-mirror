/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::c27208d6ab6791006597f11ce02c72b5>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _download = _interopRequireDefault(require("@atlaskit/icon/core/download"));
var _download2 = _interopRequireDefault(require("@atlaskit/icon/glyph/download"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for DownloadIcon.
 * This component is DownloadIcon, with `UNSAFE_fallbackIcon` set to "DownloadIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Single purpose - Reserved for file downloads.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const DownloadIcon = props => /*#__PURE__*/_react.default.createElement(_download.default, Object.assign({
  name: "DownloadIcon",
  LEGACY_fallbackIcon: _download2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
DownloadIcon.displayName = 'DownloadIconMigration';
var _default = exports.default = DownloadIcon;