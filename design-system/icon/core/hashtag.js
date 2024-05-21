"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _UNSAFE_baseNew = _interopRequireDefault(require("@atlaskit/icon/UNSAFE_base-new"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are a work in progress and subject to change or removal in future minor or patch releases.
 * Please reach out in #help-design-system before using these in production.
 *
 * Icon: "Hashtag".
 * Category: Multi-purpose
 * Location: ADS
 * Usage guidance: Known uses: topics in Atlas, tags.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const HashtagIcon = props => /*#__PURE__*/_react.default.createElement(_UNSAFE_baseNew.default, Object.assign({
  dangerouslySetGlyph: `<path stroke="currentColor" stroke-width="1.5" d="m6.75 1-2.5 14m7.5-14-2.5 14M14 10.25H1m14-4.5H2"/>`
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
HashtagIcon.displayName = 'HashtagIcon';
var _default = exports.default = HashtagIcon;