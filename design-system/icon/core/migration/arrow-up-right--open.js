/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::738825ccedd80eedcc5a76b0eb4b2e97>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _arrowUpRight = _interopRequireDefault(require("@atlaskit/icon/core/arrow-up-right"));
var _open = _interopRequireDefault(require("@atlaskit/icon/glyph/open"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for ArrowUpRightIcon.
 * This component is ArrowUpRightIcon, with `UNSAFE_fallbackIcon` set to "OpenIcon".
 *
 * Category: multi-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Known uses: open a link in a new page (but not a new tab).
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const ArrowUpRightIcon = props => /*#__PURE__*/_react.default.createElement(_arrowUpRight.default, Object.assign({
  LEGACY_fallbackIcon: _open.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
ArrowUpRightIcon.Name = 'ArrowUpRightIconMigration';
var _default = exports.default = ArrowUpRightIcon;