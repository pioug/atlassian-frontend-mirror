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
 * Updates the current theme when the system contrast preference changes. Should be bound
 * to an event listener listening on the '(prefers-contrast: more)' query
 * @param e The event representing a change in system theme.
 */
function checkNativeListener(e) {
  var element = document.documentElement;
  element.setAttribute(_constants.CONTRAST_MODE_ATTRIBUTE, e.matches ? 'more' : 'no-preference');
}
var contrastModeMql = isMatchMediaAvailable && window.matchMedia(_themeLoading.moreContrastMediaQuery);
var ContrastModeObserver = /*#__PURE__*/function () {
  function ContrastModeObserver() {
    (0, _classCallCheck2.default)(this, ContrastModeObserver);
    (0, _defineProperty2.default)(this, "unbindContrastChangeListener", null);
  }
  (0, _createClass2.default)(ContrastModeObserver, [{
    key: "getContrastMode",
    value: function getContrastMode() {
      if (!contrastModeMql) {
        return 'no-preference';
      }
      return contrastModeMql !== null && contrastModeMql !== void 0 && contrastModeMql.matches ? 'more' : 'no-preference';
    }
  }, {
    key: "bind",
    value: function bind() {
      if (contrastModeMql && this.unbindContrastChangeListener === null) {
        this.unbindContrastChangeListener = (0, _bindEventListener.bind)(contrastModeMql, {
          type: 'change',
          listener: checkNativeListener
        });
      }
    }
  }, {
    key: "unbind",
    value: function unbind() {
      if (this.unbindContrastChangeListener) {
        this.unbindContrastChangeListener();
        this.unbindContrastChangeListener = null;
      }
    }
  }]);
  return ContrastModeObserver;
}();
/**
 * A singleton contrast mode observer - binds "auto" switching logic to a single `mediaQueryList` listener
 * that can be unbound by any consumer when no longer needed.
 */
var SingletonContrastModeObserver = new ContrastModeObserver();
var _default = exports.default = SingletonContrastModeObserver;