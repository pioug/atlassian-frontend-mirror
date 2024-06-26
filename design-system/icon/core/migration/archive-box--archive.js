"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _archiveBox = _interopRequireDefault(require("@atlaskit/icon/core/archive-box"));
var _archive = _interopRequireDefault(require("@atlaskit/icon/glyph/archive"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are a work in progress and subject to change or removal in future minor or patch releases.
 * Please reach out in #help-design-system before using these in production.
 *
 * Migration Icon component for ArchiveBoxIcon.
 * This component is ArchiveBoxIcon, with `UNSAFE_fallbackIcon` set to "ArchiveIcon".
 *
 * Category: Multi-purpose
 * Location: ADS
 * Usage guidance: Known uses: archiving pages, storage.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const ArchiveBoxIcon = props => /*#__PURE__*/_react.default.createElement(_archiveBox.default, Object.assign({
  LEGACY_fallbackIcon: _archive.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
ArchiveBoxIcon.Name = 'ArchiveBoxIconMigration';
var _default = exports.default = ArchiveBoxIcon;