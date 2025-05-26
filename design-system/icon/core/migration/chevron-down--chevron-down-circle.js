/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::59626c08204f2fadde30105abe0da3b1>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _chevronDown = _interopRequireDefault(require("@atlaskit/icon/core/chevron-down"));
var _chevronDownCircle = _interopRequireDefault(require("@atlaskit/icon/glyph/chevron-down-circle"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for ChevronDownIcon.
 * This component is ChevronDownIcon, with `UNSAFE_fallbackIcon` set to "ChevronDownCircleIcon".
 *
 * Category: multi-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Do not use 16px chevrons within buttons, icon buttons, or dropdowns to maintain visual cohesion with ADS which uses 12px chevrons.
Known uses: Open dropdown menu, expanded tree item, collapse tree item
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const ChevronDownIcon = props => /*#__PURE__*/_react.default.createElement(_chevronDown.default, Object.assign({
  LEGACY_fallbackIcon: _chevronDownCircle.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
ChevronDownIcon.Name = 'ChevronDownIconMigration';
var _default = exports.default = ChevronDownIcon;