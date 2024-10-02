/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::4dd0728fe521b357ad725237c24d5eb0>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _attachment = _interopRequireDefault(require("@atlaskit/icon/core/attachment"));
var _attachment2 = _interopRequireDefault(require("@atlaskit/icon/glyph/attachment"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for AttachmentIcon.
 * This component is AttachmentIcon, with `UNSAFE_fallbackIcon` set to "AttachmentIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Single purpose - Reserved for attaching files to issues or other objects.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const AttachmentIcon = props => /*#__PURE__*/_react.default.createElement(_attachment.default, Object.assign({
  LEGACY_fallbackIcon: _attachment2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
AttachmentIcon.Name = 'AttachmentIconMigration';
var _default = exports.default = AttachmentIcon;