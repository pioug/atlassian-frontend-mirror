"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _questionCircle = _interopRequireDefault(require("@atlaskit/icon/core/question-circle"));
var _questionCircle2 = _interopRequireDefault(require("@atlaskit/icon/glyph/question-circle"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are a work in progress and subject to change or removal in future minor or patch releases.
 * Please reach out in #help-design-system before using these in production.
 *
 * Migration Icon component for QuestionCircleIcon.
 * This component is QuestionCircleIcon, with `UNSAFE_fallbackIcon` set to "QuestionCircleIcon".
 *
 * Category: Multi-purpose
 * Location: ADS
 * Usage guidance: Known uses: help, tip.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const QuestionCircleIcon = props => /*#__PURE__*/_react.default.createElement(_questionCircle.default, Object.assign({
  LEGACY_fallbackIcon: _questionCircle2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
QuestionCircleIcon.Name = 'QuestionCircleIconMigration';
var _default = exports.default = QuestionCircleIcon;