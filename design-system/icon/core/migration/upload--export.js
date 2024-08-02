"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _upload = _interopRequireDefault(require("@atlaskit/icon/core/upload"));
var _export = _interopRequireDefault(require("@atlaskit/icon/glyph/export"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are a work in progress and subject to change or removal in future minor or patch releases.
 * Please reach out in #help-design-system before using these in production.
 *
 * Migration Icon component for UploadIcon.
 * This component is UploadIcon, with `UNSAFE_fallbackIcon` set to "ExportIcon".
 *
 * Category: Single-purpose
 * Location: ADS
 * Usage guidance: Reserved for upload in Editor.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const UploadIcon = props => /*#__PURE__*/_react.default.createElement(_upload.default, Object.assign({
  LEGACY_fallbackIcon: _export.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
UploadIcon.Name = 'UploadIconMigration';
var _default = exports.default = UploadIcon;