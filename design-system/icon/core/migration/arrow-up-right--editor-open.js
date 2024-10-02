/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::13c303b9b96f49f299d678ad284f740c>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _arrowUpRight = _interopRequireDefault(require("@atlaskit/icon/core/arrow-up-right"));
var _open = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/open"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for ArrowUpRightIcon.
 * This component is ArrowUpRightIcon, with `UNSAFE_fallbackIcon` set to "EditorOpenIcon".
 *
 * Category: multi-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Multi purpose
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const ArrowUpRightIcon = props => /*#__PURE__*/_react.default.createElement(_arrowUpRight.default, Object.assign({
  LEGACY_fallbackIcon: _open.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
ArrowUpRightIcon.Name = 'ArrowUpRightIconMigration';
var _default = exports.default = ArrowUpRightIcon;