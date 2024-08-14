/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::f1ae4bac33b3e7c2f20d1b87cffe15b4>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _close = _interopRequireDefault(require("@atlaskit/icon/core/close"));
var _close2 = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/close"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for CloseIcon.
 * This component is CloseIcon, with `UNSAFE_fallbackIcon` set to "EditorCloseIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Reserved for closing an element.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const CloseIcon = props => /*#__PURE__*/_react.default.createElement(_close.default, Object.assign({
  LEGACY_fallbackIcon: _close2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
CloseIcon.Name = 'CloseIconMigration';
var _default = exports.default = CloseIcon;