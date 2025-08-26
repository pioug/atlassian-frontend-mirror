/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::0898dfe8ee99c00c49cc965ba126d199>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _teams = _interopRequireDefault(require("@atlaskit/icon/core/teams"));
var _teams2 = _interopRequireDefault(require("@atlaskit/icon/glyph/teams"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for TeamsIcon.
 * This component is TeamsIcon, with `UNSAFE_fallbackIcon` set to "TeamsIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Single purpose - Reserved for teams in Atlassian.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const TeamsIcon = props => /*#__PURE__*/_react.default.createElement(_teams.default, Object.assign({
  name: "TeamsIcon",
  LEGACY_fallbackIcon: _teams2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
TeamsIcon.displayName = 'TeamsIconMigration';
var _default = exports.default = TeamsIcon;