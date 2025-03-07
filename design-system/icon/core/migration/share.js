/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::eddb3c8fd23121248d7a9663e3c0819a>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _share = _interopRequireDefault(require("@atlaskit/icon/core/share"));
var _share2 = _interopRequireDefault(require("@atlaskit/icon/glyph/share"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for ShareIcon.
 * This component is ShareIcon, with `UNSAFE_fallbackIcon` set to "ShareIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Single purpose - Reserved for sharing an object.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const ShareIcon = props => /*#__PURE__*/_react.default.createElement(_share.default, Object.assign({
  LEGACY_fallbackIcon: _share2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
ShareIcon.Name = 'ShareIconMigration';
var _default = exports.default = ShareIcon;