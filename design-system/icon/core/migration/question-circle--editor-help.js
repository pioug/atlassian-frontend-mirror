/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::941b76084688c339e75a441c7f11784d>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _questionCircle = _interopRequireDefault(require("@atlaskit/icon/core/question-circle"));
var _help = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/help"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for QuestionCircleIcon.
 * This component is QuestionCircleIcon, with `UNSAFE_fallbackIcon` set to "EditorHelpIcon".
 *
 * Category: multi-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Multi purpose - Known uses: help, tip.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const QuestionCircleIcon = props => /*#__PURE__*/_react.default.createElement(_questionCircle.default, Object.assign({
  LEGACY_fallbackIcon: _help.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
QuestionCircleIcon.Name = 'QuestionCircleIconMigration';
var _default = exports.default = QuestionCircleIcon;