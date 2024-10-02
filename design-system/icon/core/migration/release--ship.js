/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::553e71e438a60de37e6f93988cb1bfa5>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _release = _interopRequireDefault(require("@atlaskit/icon/core/release"));
var _ship = _interopRequireDefault(require("@atlaskit/icon/glyph/ship"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for ReleaseIcon.
 * This component is ReleaseIcon, with `UNSAFE_fallbackIcon` set to "ShipIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Single purpose - Reserved for releases in Jira.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const ReleaseIcon = props => /*#__PURE__*/_react.default.createElement(_release.default, Object.assign({
  LEGACY_fallbackIcon: _ship.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
ReleaseIcon.Name = 'ReleaseIconMigration';
var _default = exports.default = ReleaseIcon;