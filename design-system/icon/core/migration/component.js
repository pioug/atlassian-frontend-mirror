/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::da0267977d4fd4db39bb0c8d9560ed2a>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _component = _interopRequireDefault(require("@atlaskit/icon/core/component"));
var _component2 = _interopRequireDefault(require("@atlaskit/icon/glyph/component"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for ComponentIcon.
 * This component is ComponentIcon, with `UNSAFE_fallbackIcon` set to "ComponentIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Single purpose - Reserved for components in Jira and Compass.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const ComponentIcon = props => /*#__PURE__*/_react.default.createElement(_component.default, Object.assign({
  LEGACY_fallbackIcon: _component2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
ComponentIcon.Name = 'ComponentIconMigration';
var _default = exports.default = ComponentIcon;