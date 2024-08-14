/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::5ddf703a3898484fd0d8552418ae16a3>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _linkBroken = _interopRequireDefault(require("@atlaskit/icon/core/link-broken"));
var _unlink = _interopRequireDefault(require("@atlaskit/icon/glyph/unlink"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for LinkBrokenIcon.
 * This component is LinkBrokenIcon, with `UNSAFE_fallbackIcon` set to "UnlinkIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Reserved for removing a link.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const LinkBrokenIcon = props => /*#__PURE__*/_react.default.createElement(_linkBroken.default, Object.assign({
  LEGACY_fallbackIcon: _unlink.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
LinkBrokenIcon.Name = 'LinkBrokenIconMigration';
var _default = exports.default = LinkBrokenIcon;