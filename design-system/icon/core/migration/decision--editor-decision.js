/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::09b32cb7d4442686961e5cde83b86b0a>>
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
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for DecisionIcon.
 * This component is DecisionIcon, with `UNSAFE_fallbackIcon` set to "EditorDecisionIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Single purpose - Reserved for decisions.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const DecisionIcon = props => /*#__PURE__*/_react.default.createElement(_decision.default, Object.assign({
  name: "DecisionIcon",
  LEGACY_fallbackIcon: _decision2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
DecisionIcon.displayName = 'DecisionIconMigration';
var _default = exports.default = DecisionIcon;