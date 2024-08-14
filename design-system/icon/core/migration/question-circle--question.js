/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::fd1ef2070f89f052189d8f44b3931579>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _questionCircle = _interopRequireDefault(require("@atlaskit/icon/core/question-circle"));
var _question = _interopRequireDefault(require("@atlaskit/icon/glyph/question"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for QuestionCircleIcon.
 * This component is QuestionCircleIcon, with `UNSAFE_fallbackIcon` set to "QuestionIcon".
 *
 * Category: multi-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Known uses: help, tip.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const QuestionCircleIcon = props => /*#__PURE__*/_react.default.createElement(_questionCircle.default, Object.assign({
  LEGACY_fallbackIcon: _question.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
QuestionCircleIcon.Name = 'QuestionCircleIconMigration';
var _default = exports.default = QuestionCircleIcon;