/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::61294e82620ade34c81f7146cd1d05c9>>
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
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for FlaskIcon.
 * This component is FlaskIcon, with `UNSAFE_fallbackIcon` set to "JiraLabsIcon".
 *
 * Category: multi-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Known uses: labs in Jira.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const FlaskIcon = props => /*#__PURE__*/_react.default.createElement(_flask.default, Object.assign({
  LEGACY_fallbackIcon: _labs.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
FlaskIcon.Name = 'FlaskIconMigration';
var _default = exports.default = FlaskIcon;