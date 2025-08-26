/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::4fcbc61a1973a2cc16d159206d4f09db>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _flask = _interopRequireDefault(require("@atlaskit/icon/core/flask"));
var _labs = _interopRequireDefault(require("@atlaskit/icon/glyph/jira/labs"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for FlaskIcon.
 * This component is FlaskIcon, with `UNSAFE_fallbackIcon` set to "JiraLabsIcon".
 *
 * Category: multi-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Multi purpose - Known uses: labs in Jira.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const FlaskIcon = props => /*#__PURE__*/_react.default.createElement(_flask.default, Object.assign({
  name: "FlaskIcon",
  LEGACY_fallbackIcon: _labs.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
FlaskIcon.displayName = 'FlaskIconMigration';
var _default = exports.default = FlaskIcon;