/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::ffb3eee7b92db2782a45444d8dbb123a>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _chevronRight = _interopRequireDefault(require("@atlaskit/icon/core/chevron-right"));
var _chevronRightLarge = _interopRequireDefault(require("@atlaskit/icon/glyph/chevron-right-large"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for ChevronRightIcon.
 * This component is ChevronRightIcon, with `UNSAFE_fallbackIcon` set to "ChevronRightLargeIcon".
 *
 * Category: multi-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Do not use 16px chevrons within buttons, icon buttons, or dropdowns to maintain visual cohesion with ADS which uses 12px chevrons.
Known uses: Next page of pagination results, collapsed tree item, expand tree item
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const ChevronRightIcon = props => /*#__PURE__*/_react.default.createElement(_chevronRight.default, Object.assign({
  name: "ChevronRightIcon",
  LEGACY_fallbackIcon: _chevronRightLarge.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
ChevronRightIcon.displayName = 'ChevronRightIconMigration';
var _default = exports.default = ChevronRightIcon;