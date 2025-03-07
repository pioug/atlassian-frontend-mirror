/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::083750d66f8ddafc04b4d764ea361b41>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _discovery = _interopRequireDefault(require("@atlaskit/icon/core/discovery"));
var _note = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/note"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for DiscoveryIcon.
 * This component is DiscoveryIcon, with `UNSAFE_fallbackIcon` set to "EditorNoteIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Single purpose - Reserved for representing discovery. Used for Note info panel variant in Editor.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const DiscoveryIcon = props => /*#__PURE__*/_react.default.createElement(_discovery.default, Object.assign({
  LEGACY_fallbackIcon: _note.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
DiscoveryIcon.Name = 'DiscoveryIconMigration';
var _default = exports.default = DiscoveryIcon;