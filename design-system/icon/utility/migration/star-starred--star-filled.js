/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::4fb6e9f5760945cb9bfe8506df078935>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _starStarred = _interopRequireDefault(require("@atlaskit/icon/utility/star-starred"));
var _starFilled = _interopRequireDefault(require("@atlaskit/icon/glyph/star-filled"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for StarStarredIcon.
 * This component is StarStarredIcon, with `UNSAFE_fallbackIcon` set to "StarFilledIcon".
 *
 * Category: utility
 * Location: @atlaskit/icon
 * Usage guidance: Reserved for starred or favourited objects as a secondary/tertiary action.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const StarStarredIcon = props => /*#__PURE__*/_react.default.createElement(_starStarred.default, Object.assign({
  LEGACY_fallbackIcon: _starFilled.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
StarStarredIcon.Name = 'StarStarredIconMigration';
var _default = exports.default = StarStarredIcon;