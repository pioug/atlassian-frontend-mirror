/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::99707334fb48ab501a94d59903111ee8>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _crossCircle = _interopRequireDefault(require("@atlaskit/icon/core/cross-circle"));
var _crossCircle2 = _interopRequireDefault(require("@atlaskit/icon/glyph/cross-circle"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for CrossCircleIcon.
 * This component is CrossCircleIcon, with `UNSAFE_fallbackIcon` set to "CrossCircleIcon".
 *
 * Category: multi-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Known uses: clear text field, error status icon.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const CrossCircleIcon = props => /*#__PURE__*/_react.default.createElement(_crossCircle.default, Object.assign({
  LEGACY_fallbackIcon: _crossCircle2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
CrossCircleIcon.Name = 'CrossCircleIconMigration';
var _default = exports.default = CrossCircleIcon;