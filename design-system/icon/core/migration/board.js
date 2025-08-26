/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::70cf26195518c0bb639ffcf7bd9325d6>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _board = _interopRequireDefault(require("@atlaskit/icon/core/board"));
var _board2 = _interopRequireDefault(require("@atlaskit/icon/glyph/board"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for BoardIcon.
 * This component is BoardIcon, with `UNSAFE_fallbackIcon` set to "BoardIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Single purpose - Reserved for boards in Jira.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const BoardIcon = props => /*#__PURE__*/_react.default.createElement(_board.default, Object.assign({
  name: "BoardIcon",
  LEGACY_fallbackIcon: _board2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
BoardIcon.displayName = 'BoardIconMigration';
var _default = exports.default = BoardIcon;