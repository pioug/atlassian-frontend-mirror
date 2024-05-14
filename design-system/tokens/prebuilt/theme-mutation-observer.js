"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _platformFeatureFlags = require("@atlaskit/platform-feature-flags");
var _constants = require("./constants");
var _getGlobalTheme = _interopRequireDefault(require("./get-global-theme"));
/**
 * A MutationObserver which watches the `<html>` element for changes to the theme.
 *
 * In React, use the {@link useThemeObserver `useThemeObserver`} hook instead.
 *
 * @param {function} callback - A callback function which fires when the theme changes.
 *
 * @example
 * ```
 * const observer = new ThemeMutationObserver((theme) => {});
 * observer.observe();
 * ```
 */
var ThemeMutationObserver = exports.default = /*#__PURE__*/function () {
  function ThemeMutationObserver(callback) {
    (0, _classCallCheck2.default)(this, ThemeMutationObserver);
    (0, _defineProperty2.default)(this, "legacyObserver", null);
    this.callback = callback;
    if ((0, _platformFeatureFlags.getBooleanFF)('platform.design-system-team.mutation-observer-performance-improvement_8usdg')) {
      ThemeMutationObserver.callbacks.add(callback);
    }
  }
  (0, _createClass2.default)(ThemeMutationObserver, [{
    key: "observe",
    value: function observe() {
      var _this = this;
      if ((0, _platformFeatureFlags.getBooleanFF)('platform.design-system-team.mutation-observer-performance-improvement_8usdg')) {
        if (!ThemeMutationObserver.observer) {
          ThemeMutationObserver.observer = new MutationObserver(function () {
            var theme = (0, _getGlobalTheme.default)();
            ThemeMutationObserver.callbacks.forEach(function (callback) {
              return callback(theme);
            });
          });
          // Observer only needs to be configured once
          ThemeMutationObserver.observer.observe(document.documentElement, {
            attributeFilter: [_constants.THEME_DATA_ATTRIBUTE, _constants.COLOR_MODE_ATTRIBUTE]
          });
        }
      } else {
        if (!this.legacyObserver) {
          this.legacyObserver = new MutationObserver(function () {
            _this.callback((0, _getGlobalTheme.default)());
          });
        }
        this.legacyObserver.observe(document.documentElement, {
          attributeFilter: [_constants.THEME_DATA_ATTRIBUTE, _constants.COLOR_MODE_ATTRIBUTE]
        });
      }
    }
  }, {
    key: "disconnect",
    value: function disconnect() {
      if ((0, _platformFeatureFlags.getBooleanFF)('platform.design-system-team.mutation-observer-performance-improvement_8usdg')) {
        if (this.callback) {
          ThemeMutationObserver.callbacks.delete(this.callback);
        }
        if (ThemeMutationObserver.callbacks.size === 0 && ThemeMutationObserver.observer) {
          ThemeMutationObserver.observer.disconnect();
          ThemeMutationObserver.observer = null;
        }
      } else {
        this.legacyObserver && this.legacyObserver.disconnect();
      }
    }
  }]);
  return ThemeMutationObserver;
}();
(0, _defineProperty2.default)(ThemeMutationObserver, "observer", null);
(0, _defineProperty2.default)(ThemeMutationObserver, "callbacks", new Set());