/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::18cd44b40ff8809efea24ae850576bc8>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _cross = _interopRequireDefault(require("@atlaskit/icon/core/cross"));
var _close = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/close"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for CrossIcon.
 * This component is CrossIcon, with `UNSAFE_fallbackIcon` set to "EditorCloseIcon".
 *
 * Category: multi-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Known uses: closing modals, panels, and transient views; removing tags
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const CrossIcon = props => /*#__PURE__*/_react.default.createElement(_cross.default, Object.assign({
  name: "CrossIcon",
  LEGACY_fallbackIcon: _close.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
CrossIcon.displayName = 'CrossIconMigration';
var _default = exports.default = CrossIcon;