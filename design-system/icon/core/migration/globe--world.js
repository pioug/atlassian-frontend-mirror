/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::bfa480f43d6d2cb52a0e0ba9712304a9>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _globe = _interopRequireDefault(require("@atlaskit/icon/core/globe"));
var _world = _interopRequireDefault(require("@atlaskit/icon/glyph/world"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for GlobeIcon.
 * This component is GlobeIcon, with `UNSAFE_fallbackIcon` set to "WorldIcon".
 *
 * Category: multi-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Multi purpose - Known uses: public link in Confluence share dialog, global rules in Automation.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const GlobeIcon = props => /*#__PURE__*/_react.default.createElement(_globe.default, Object.assign({
  LEGACY_fallbackIcon: _world.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
GlobeIcon.Name = 'GlobeIconMigration';
var _default = exports.default = GlobeIcon;