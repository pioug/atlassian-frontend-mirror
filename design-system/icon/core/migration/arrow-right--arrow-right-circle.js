/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::7c6e834f7127447f187253f462afe4fc>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _arrowRight = _interopRequireDefault(require("@atlaskit/icon/core/arrow-right"));
var _arrowRightCircle = _interopRequireDefault(require("@atlaskit/icon/glyph/arrow-right-circle"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for ArrowRightIcon.
 * This component is ArrowRightIcon, with `UNSAFE_fallbackIcon` set to "ArrowRightCircleIcon".
 *
 * Category: multi-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Multi purpose - Known uses: link to nested menu item, a linked menu item, next slide.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const ArrowRightIcon = props => /*#__PURE__*/_react.default.createElement(_arrowRight.default, Object.assign({
  name: "ArrowRightIcon",
  LEGACY_fallbackIcon: _arrowRightCircle.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
ArrowRightIcon.displayName = 'ArrowRightIconMigration';
var _default = exports.default = ArrowRightIcon;