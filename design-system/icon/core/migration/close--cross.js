/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::35b8c6b585772b9406ca86ab3c3befd4>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _close = _interopRequireDefault(require("@atlaskit/icon/core/close"));
var _cross = _interopRequireDefault(require("@atlaskit/icon/glyph/cross"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for CloseIcon.
 * This component is CloseIcon, with `UNSAFE_fallbackIcon` set to "CrossIcon".
 *
 * Category: multi-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Known uses: closing modals, panels, and transient views; removing tags
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const CloseIcon = props => /*#__PURE__*/_react.default.createElement(_close.default, Object.assign({
  LEGACY_fallbackIcon: _cross.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
CloseIcon.Name = 'CloseIconMigration';
var _default = exports.default = CloseIcon;