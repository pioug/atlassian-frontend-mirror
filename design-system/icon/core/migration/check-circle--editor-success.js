/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::8a888b1ced47bb8d7fb1106eba55e460>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _checkCircle = _interopRequireDefault(require("@atlaskit/icon/core/check-circle"));
var _success = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/success"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for CheckCircleIcon.
 * This component is CheckCircleIcon, with `UNSAFE_fallbackIcon` set to "EditorSuccessIcon".
 *
 * Category: multi-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Known uses: success section messages or a list of done items.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const CheckCircleIcon = props => /*#__PURE__*/_react.default.createElement(_checkCircle.default, Object.assign({
  LEGACY_fallbackIcon: _success.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
CheckCircleIcon.Name = 'CheckCircleIconMigration';
var _default = exports.default = CheckCircleIcon;