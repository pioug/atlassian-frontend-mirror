/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::77421a4093efbe74a1bbe8da5d5c5bff>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _peopleGroup = _interopRequireDefault(require("@atlaskit/icon/core/people-group"));
var _people = _interopRequireDefault(require("@atlaskit/icon/glyph/people"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for PeopleGroupIcon.
 * This component is PeopleGroupIcon, with `UNSAFE_fallbackIcon` set to "PeopleIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Single purpose - Known uses: representing a group or collection of people or users.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const PeopleGroupIcon = props => /*#__PURE__*/_react.default.createElement(_peopleGroup.default, Object.assign({
  name: "PeopleGroupIcon",
  LEGACY_fallbackIcon: _people.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
PeopleGroupIcon.displayName = 'PeopleGroupIconMigration';
var _default = exports.default = PeopleGroupIcon;