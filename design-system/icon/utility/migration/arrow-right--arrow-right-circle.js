/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::f8c0e3ac917ba46b02ebf3b2e95a53e1>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _arrowRight = _interopRequireDefault(require("@atlaskit/icon/utility/arrow-right"));
var _arrowRightCircle = _interopRequireDefault(require("@atlaskit/icon/glyph/arrow-right-circle"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for ArrowRightIcon.
 * This component is ArrowRightIcon, with `UNSAFE_fallbackIcon` set to "ArrowRightCircleIcon".
 *
 * Category: utility
 * Location: @atlaskit/icon
 * Usage guidance: Known uses: link to nested menu item, a linked menu item, next slide.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const ArrowRightIcon = props => /*#__PURE__*/_react.default.createElement(_arrowRight.default, Object.assign({
  LEGACY_fallbackIcon: _arrowRightCircle.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
ArrowRightIcon.Name = 'ArrowRightIconMigration';
var _default = exports.default = ArrowRightIcon;