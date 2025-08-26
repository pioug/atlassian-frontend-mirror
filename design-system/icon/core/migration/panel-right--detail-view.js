/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::514cbdd1fb828ca052784fd79788c51d>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _panelRight = _interopRequireDefault(require("@atlaskit/icon/core/panel-right"));
var _detailView = _interopRequireDefault(require("@atlaskit/icon/glyph/detail-view"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for PanelRightIcon.
 * This component is PanelRightIcon, with `UNSAFE_fallbackIcon` set to "DetailViewIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Reserved for opening a preview panel to the right of the viewport edge. Use only for left-to-right languages.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const PanelRightIcon = props => /*#__PURE__*/_react.default.createElement(_panelRight.default, Object.assign({
  name: "PanelRightIcon",
  LEGACY_fallbackIcon: _detailView.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
PanelRightIcon.displayName = 'PanelRightIconMigration';
var _default = exports.default = PanelRightIcon;