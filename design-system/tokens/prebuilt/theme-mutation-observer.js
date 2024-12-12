"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
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
    ThemeMutationObserver.callbacks.add(callback);
  }
  return (0, _createClass2.default)(ThemeMutationObserver, [{
    key: "observe",
    value: function observe() {
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
    }
  }, {
    key: "disconnect",
    value: function disconnect() {
      if (this.callback) {
        ThemeMutationObserver.callbacks.delete(this.callback);
      }
      if (ThemeMutationObserver.callbacks.size === 0 && ThemeMutationObserver.observer) {
        ThemeMutationObserver.observer.disconnect();
        ThemeMutationObserver.observer = null;
      }
    }
  }]);
}();
(0, _defineProperty2.default)(ThemeMutationObserver, "observer", null);
(0, _defineProperty2.default)(ThemeMutationObserver, "callbacks", new Set());