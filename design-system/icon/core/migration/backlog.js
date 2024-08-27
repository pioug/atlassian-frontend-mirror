/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::768dd9bc42beda0d7f11c4153086d7d9>>
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
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
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
  LEGACY_fallbackIcon: _backlog2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
BacklogIcon.Name = 'BacklogIconMigration';
var _default = exports.default = BacklogIcon;