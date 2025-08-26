/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::b90d358c685d105215e4663cc28afcc7>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _archiveBox = _interopRequireDefault(require("@atlaskit/icon/core/archive-box"));
var _archive = _interopRequireDefault(require("@atlaskit/icon/glyph/archive"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for ArchiveBoxIcon.
 * This component is ArchiveBoxIcon, with `UNSAFE_fallbackIcon` set to "ArchiveIcon".
 *
 * Category: multi-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Multi purpose - Known uses: archiving pages, storage.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const ArchiveBoxIcon = props => /*#__PURE__*/_react.default.createElement(_archiveBox.default, Object.assign({
  name: "ArchiveBoxIcon",
  LEGACY_fallbackIcon: _archive.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
ArchiveBoxIcon.displayName = 'ArchiveBoxIconMigration';
var _default = exports.default = ArchiveBoxIcon;