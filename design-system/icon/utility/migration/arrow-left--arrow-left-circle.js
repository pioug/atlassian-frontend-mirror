/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::0b91cd52528b566644e0221c7aeb65fa>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _arrowLeft = _interopRequireDefault(require("@atlaskit/icon/utility/arrow-left"));
var _arrowLeftCircle = _interopRequireDefault(require("@atlaskit/icon/glyph/arrow-left-circle"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for ArrowLeftIcon.
 * This component is ArrowLeftIcon, with `UNSAFE_fallbackIcon` set to "ArrowLeftCircleIcon".
 *
 * Category: utility
 * Location: @atlaskit/icon
 * Usage guidance: Known uses: back to previous screen, previous slide.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const ArrowLeftIcon = props => /*#__PURE__*/_react.default.createElement(_arrowLeft.default, Object.assign({
  LEGACY_fallbackIcon: _arrowLeftCircle.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
ArrowLeftIcon.Name = 'ArrowLeftIconMigration';
var _default = exports.default = ArrowLeftIcon;