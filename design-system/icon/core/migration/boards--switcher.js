/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::5413d3ffa9ff21cfed5b716d941d5991>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _boards = _interopRequireDefault(require("@atlaskit/icon/core/boards"));
var _switcher = _interopRequireDefault(require("@atlaskit/icon/glyph/switcher"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for BoardsIcon.
 * This component is BoardsIcon, with `UNSAFE_fallbackIcon` set to "SwitcherIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Single purpose - Reserved as the icon to represent multiple boards.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const BoardsIcon = props => /*#__PURE__*/_react.default.createElement(_boards.default, Object.assign({
  name: "BoardsIcon",
  LEGACY_fallbackIcon: _switcher.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
BoardsIcon.displayName = 'BoardsIconMigration';
var _default = exports.default = BoardsIcon;