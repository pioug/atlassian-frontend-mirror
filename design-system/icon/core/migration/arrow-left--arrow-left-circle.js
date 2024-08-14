/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::a0bd1e9988640d8f6348bcf3c9e35352>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _arrowLeft = _interopRequireDefault(require("@atlaskit/icon/core/arrow-left"));
var _arrowLeftCircle = _interopRequireDefault(require("@atlaskit/icon/glyph/arrow-left-circle"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for ArrowLeftIcon.
 * This component is ArrowLeftIcon, with `UNSAFE_fallbackIcon` set to "ArrowLeftCircleIcon".
 *
 * Category: multi-purpose
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