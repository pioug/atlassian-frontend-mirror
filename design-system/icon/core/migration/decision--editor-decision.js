/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::3555523a42c123f1c2a8279a1d59c336>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _decision = _interopRequireDefault(require("@atlaskit/icon/core/decision"));
var _decision2 = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/decision"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for DecisionIcon.
 * This component is DecisionIcon, with `UNSAFE_fallbackIcon` set to "EditorDecisionIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Reserved for decisions.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const DecisionIcon = props => /*#__PURE__*/_react.default.createElement(_decision.default, Object.assign({
  LEGACY_fallbackIcon: _decision2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
DecisionIcon.Name = 'DecisionIconMigration';
var _default = exports.default = DecisionIcon;