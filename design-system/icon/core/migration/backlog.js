/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::fe730c8634f6209c2dd23a8cd73cdcc9>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _backlog = _interopRequireDefault(require("@atlaskit/icon/core/backlog"));
var _backlog2 = _interopRequireDefault(require("@atlaskit/icon/glyph/backlog"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for BacklogIcon.
 * This component is BacklogIcon, with `UNSAFE_fallbackIcon` set to "BacklogIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Single purpose - Reserved for backlogs in Jira.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const BacklogIcon = props => /*#__PURE__*/_react.default.createElement(_backlog.default, Object.assign({
  name: "BacklogIcon",
  LEGACY_fallbackIcon: _backlog2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
BacklogIcon.displayName = 'BacklogIconMigration';
var _default = exports.default = BacklogIcon;