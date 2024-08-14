/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::b7153374bd66c23008629396a8ef1772>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _alignLeft = _interopRequireDefault(require("@atlaskit/icon/core/align-left"));
var _overview = _interopRequireDefault(require("@atlaskit/icon/glyph/overview"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for AlignLeftIcon.
 * This component is AlignLeftIcon, with `UNSAFE_fallbackIcon` set to "OverviewIcon".
 *
 * Category: multi-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Known uses: align text left, align content left, summary.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const AlignLeftIcon = props => /*#__PURE__*/_react.default.createElement(_alignLeft.default, Object.assign({
  LEGACY_fallbackIcon: _overview.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
AlignLeftIcon.Name = 'AlignLeftIconMigration';
var _default = exports.default = AlignLeftIcon;