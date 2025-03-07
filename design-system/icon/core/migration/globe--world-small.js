/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::1816955fc70f3b0c91cbf12c45c79425>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _globe = _interopRequireDefault(require("@atlaskit/icon/core/globe"));
var _worldSmall = _interopRequireDefault(require("@atlaskit/icon/glyph/world-small"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for GlobeIcon.
 * This component is GlobeIcon, with `UNSAFE_fallbackIcon` set to "WorldSmallIcon".
 *
 * Category: multi-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Multi purpose - Known uses: public link in Confluence share dialog, global rules in Automation.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const GlobeIcon = props => /*#__PURE__*/_react.default.createElement(_globe.default, Object.assign({
  LEGACY_fallbackIcon: _worldSmall.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
GlobeIcon.Name = 'GlobeIconMigration';
var _default = exports.default = GlobeIcon;