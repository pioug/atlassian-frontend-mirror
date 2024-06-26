"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _information = _interopRequireDefault(require("@atlaskit/icon/utility/information"));
var _panel = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/panel"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are a work in progress and subject to change or removal in future minor or patch releases.
 * Please reach out in #help-design-system before using these in production.
 *
 * Migration Icon component for InformationIcon.
 * This component is InformationIcon, with `UNSAFE_fallbackIcon` set to "EditorPanelIcon".
 *
 * Category: Multi-purpose
 * Location: ADS
 * Usage guidance: Reserved for Helper Messages in Forms.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const InformationIcon = props => /*#__PURE__*/_react.default.createElement(_information.default, Object.assign({
  LEGACY_fallbackIcon: _panel.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
InformationIcon.Name = 'InformationIconMigration';
var _default = exports.default = InformationIcon;