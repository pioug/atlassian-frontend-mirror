/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::735083f165a44264d74e7f40675bde7b>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _checkMark = _interopRequireDefault(require("@atlaskit/icon/utility/check-mark"));
var _done = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/done"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for CheckMarkIcon.
 * This component is CheckMarkIcon, with `UNSAFE_fallbackIcon` set to "EditorDoneIcon".
 *
 * Category: utility
 * Location: @atlaskit/icon
 * Usage guidance: TBD
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const CheckMarkIcon = props => /*#__PURE__*/_react.default.createElement(_checkMark.default, Object.assign({
  LEGACY_fallbackIcon: _done.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
CheckMarkIcon.Name = 'CheckMarkIconMigration';
var _default = exports.default = CheckMarkIcon;