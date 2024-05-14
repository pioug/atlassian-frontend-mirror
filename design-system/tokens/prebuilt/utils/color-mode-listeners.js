"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _bindEventListener = require("bind-event-listener");
var _constants = require("../constants");
var _themeLoading = require("./theme-loading");
var isMatchMediaAvailable = typeof window !== 'undefined' && 'matchMedia' in window;

/**
 * Updates the current theme when the system theme changes. Should be bound
 * to an event listener listening on the '(prefers-color-scheme: dark)' query
 * @param e The event representing a change in system theme.
 */
function checkNativeListener(e) {
  var element = document.documentElement;
  element.setAttribute(_constants.COLOR_MODE_ATTRIBUTE, e.matches ? 'dark' : 'light');
}
var darkModeMql = isMatchMediaAvailable && window.matchMedia(_themeLoading.darkModeMediaQuery);
var ColorModeObserver = /*#__PURE__*/function () {
  function ColorModeObserver() {
    (0, _classCallCheck2.default)(this, ColorModeObserver);
    (0, _defineProperty2.default)(this, "unbindThemeChangeListener", null);
  }
  (0, _createClass2.default)(ColorModeObserver, [{
    key: "getColorMode",
    value: function getColorMode() {
      if (!darkModeMql) {
        return 'light';
      }
      return darkModeMql !== null && darkModeMql !== void 0 && darkModeMql.matches ? 'dark' : 'light';
    }
  }, {
    key: "bind",
    value: function bind() {
      if (darkModeMql && this.unbindThemeChangeListener === null) {
        this.unbindThemeChangeListener = (0, _bindEventListener.bind)(darkModeMql, {
          type: 'change',
          listener: checkNativeListener
        });
      }
    }
  }, {
    key: "unbind",
    value: function unbind() {
      if (this.unbindThemeChangeListener) {
        this.unbindThemeChangeListener();
        this.unbindThemeChangeListener = null;
      }
    }
  }]);
  return ColorModeObserver;
}();
/**
 * A singleton color mode observer - binds "auto" switching logic to a single `mediaQueryList` listener
 * that can be unbound by any consumer when no longer needed.
 */
var SingletonColorModeObserver = new ColorModeObserver();
var _default = exports.default = SingletonColorModeObserver;