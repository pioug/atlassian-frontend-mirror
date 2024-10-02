/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::08a0321457cb5aed7e2772729ddee0a6>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _checkCircle = _interopRequireDefault(require("@atlaskit/icon/core/check-circle"));
var _checkCircle2 = _interopRequireDefault(require("@atlaskit/icon/glyph/check-circle"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for CheckCircleIcon.
 * This component is CheckCircleIcon, with `UNSAFE_fallbackIcon` set to "CheckCircleIcon".
 *
 * Category: multi-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Multi purpose - Known uses: completed items, productivity emoji category. Completed task issue status in JSM Calendar view.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const CheckCircleIcon = props => /*#__PURE__*/_react.default.createElement(_checkCircle.default, Object.assign({
  LEGACY_fallbackIcon: _checkCircle2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
CheckCircleIcon.Name = 'CheckCircleIconMigration';
var _default = exports.default = CheckCircleIcon;