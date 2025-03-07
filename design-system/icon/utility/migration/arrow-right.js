/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::625e9b14bed69a7182f0ece24fa2120b>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _arrowRight = _interopRequireDefault(require("@atlaskit/icon/utility/arrow-right"));
var _arrowRight2 = _interopRequireDefault(require("@atlaskit/icon/glyph/arrow-right"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for ArrowRightIcon.
 * This component is ArrowRightIcon, with `UNSAFE_fallbackIcon` set to "ArrowRightIcon".
 *
 * Category: utility
 * Location: @atlaskit/icon
 * Usage guidance: Known uses: link to nested menu item, a linked menu item, next slide.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const ArrowRightIcon = props => /*#__PURE__*/_react.default.createElement(_arrowRight.default, Object.assign({
  LEGACY_fallbackIcon: _arrowRight2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
ArrowRightIcon.Name = 'ArrowRightIconMigration';
var _default = exports.default = ArrowRightIcon;