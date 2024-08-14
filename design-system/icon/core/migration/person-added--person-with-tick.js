/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::fd025db2a2d062182d6dde1cb6e5ed45>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _personAdded = _interopRequireDefault(require("@atlaskit/icon/core/person-added"));
var _personWithTick = _interopRequireDefault(require("@atlaskit/icon/glyph/person-with-tick"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for PersonAddedIcon.
 * This component is PersonAddedIcon, with `UNSAFE_fallbackIcon` set to "PersonWithTickIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Reserved for a user added to an object.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const PersonAddedIcon = props => /*#__PURE__*/_react.default.createElement(_personAdded.default, Object.assign({
  LEGACY_fallbackIcon: _personWithTick.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
PersonAddedIcon.Name = 'PersonAddedIconMigration';
var _default = exports.default = PersonAddedIcon;