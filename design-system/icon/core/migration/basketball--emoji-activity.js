/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::44dae4191bbcab0727030b21ffd03d39>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _basketball = _interopRequireDefault(require("@atlaskit/icon/core/basketball"));
var _activity = _interopRequireDefault(require("@atlaskit/icon/glyph/emoji/activity"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for BasketballIcon.
 * This component is BasketballIcon, with `UNSAFE_fallbackIcon` set to "EmojiActivityIcon".
 *
 * Category: multi-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Multi purpose - Known usages: Sport emoji category.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const BasketballIcon = props => /*#__PURE__*/_react.default.createElement(_basketball.default, Object.assign({
  LEGACY_fallbackIcon: _activity.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
BasketballIcon.Name = 'BasketballIconMigration';
var _default = exports.default = BasketballIcon;