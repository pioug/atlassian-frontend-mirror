/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::6e97139806ccf4544d24fa036cbca8b4>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _home = _interopRequireDefault(require("@atlaskit/icon/core/home"));
var _homeCircle = _interopRequireDefault(require("@atlaskit/icon/glyph/home-circle"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for HomeIcon.
 * This component is HomeIcon, with `UNSAFE_fallbackIcon` set to "HomeCircleIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Single purpose - Reserved for home in navigation. When a user clicks on this, they should return to the homepage.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const HomeIcon = props => /*#__PURE__*/_react.default.createElement(_home.default, Object.assign({
  LEGACY_fallbackIcon: _homeCircle.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
HomeIcon.Name = 'HomeIconMigration';
var _default = exports.default = HomeIcon;