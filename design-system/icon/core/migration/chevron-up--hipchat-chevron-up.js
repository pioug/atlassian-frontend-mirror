/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::9122dabf5a4e80a209ec2f5b7da6e804>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _chevronUp = _interopRequireDefault(require("@atlaskit/icon/core/chevron-up"));
var _chevronUp2 = _interopRequireDefault(require("@atlaskit/icon/glyph/hipchat/chevron-up"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for ChevronUpIcon.
 * This component is ChevronUpIcon, with `UNSAFE_fallbackIcon` set to "HipchatChevronUpIcon".
 *
 * Category: multi-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Do not use 16px chevrons within buttons, icon buttons, or dropdowns to maintain visual cohesion with ADS which uses 12px chevrons.
Known uses: Close dropdown menu
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const ChevronUpIcon = props => /*#__PURE__*/_react.default.createElement(_chevronUp.default, Object.assign({
  name: "ChevronUpIcon",
  LEGACY_fallbackIcon: _chevronUp2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
ChevronUpIcon.displayName = 'ChevronUpIconMigration';
var _default = exports.default = ChevronUpIcon;