/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::7a71f35abbf70ff4f0abf42675f4f092>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _takeoutFood = _interopRequireDefault(require("@atlaskit/icon/core/takeout-food"));
var _food = _interopRequireDefault(require("@atlaskit/icon/glyph/emoji/food"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for TakeoutFoodIcon.
 * This component is TakeoutFoodIcon, with `UNSAFE_fallbackIcon` set to "EmojiFoodIcon".
 *
 * Category: multi-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Multi purpose - Known usages: Food emoji category.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const TakeoutFoodIcon = props => /*#__PURE__*/_react.default.createElement(_takeoutFood.default, Object.assign({
  name: "TakeoutFoodIcon",
  LEGACY_fallbackIcon: _food.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
TakeoutFoodIcon.displayName = 'TakeoutFoodIconMigration';
var _default = exports.default = TakeoutFoodIcon;