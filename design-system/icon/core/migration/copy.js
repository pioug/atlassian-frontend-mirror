/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::746afd86dff7a846534476462b8fe4e7>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _copy = _interopRequireDefault(require("@atlaskit/icon/core/copy"));
var _copy2 = _interopRequireDefault(require("@atlaskit/icon/glyph/copy"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for CopyIcon.
 * This component is CopyIcon, with `UNSAFE_fallbackIcon` set to "CopyIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Single purpose - Reserved for copying data such as text, code or other objects.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const CopyIcon = props => /*#__PURE__*/_react.default.createElement(_copy.default, Object.assign({
  LEGACY_fallbackIcon: _copy2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
CopyIcon.Name = 'CopyIconMigration';
var _default = exports.default = CopyIcon;