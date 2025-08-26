/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::93a1602ee77f410cde6e34912a165a5c>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _personAdded = _interopRequireDefault(require("@atlaskit/icon/core/person-added"));
var _appAccess = _interopRequireDefault(require("@atlaskit/icon/glyph/app-access"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for PersonAddedIcon.
 * This component is PersonAddedIcon, with `UNSAFE_fallbackIcon` set to "AppAccessIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Single purpose - Reserved for a user added to an object.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const PersonAddedIcon = props => /*#__PURE__*/_react.default.createElement(_personAdded.default, Object.assign({
  name: "PersonAddedIcon",
  LEGACY_fallbackIcon: _appAccess.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
PersonAddedIcon.displayName = 'PersonAddedIconMigration';
var _default = exports.default = PersonAddedIcon;