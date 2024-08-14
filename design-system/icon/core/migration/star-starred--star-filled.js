/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::67d8bc791ed5ee5c57c5d750c07aa421>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _starStarred = _interopRequireDefault(require("@atlaskit/icon/core/star-starred"));
var _starFilled = _interopRequireDefault(require("@atlaskit/icon/glyph/star-filled"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for StarStarredIcon.
 * This component is StarStarredIcon, with `UNSAFE_fallbackIcon` set to "StarFilledIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Reserved for starred or favourited objects.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const StarStarredIcon = props => /*#__PURE__*/_react.default.createElement(_starStarred.default, Object.assign({
  LEGACY_fallbackIcon: _starFilled.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
StarStarredIcon.Name = 'StarStarredIconMigration';
var _default = exports.default = StarStarredIcon;