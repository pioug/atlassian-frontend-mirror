"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _react = require("react");
var _getGlobalTheme = _interopRequireDefault(require("./get-global-theme"));
var _themeMutationObserver = _interopRequireDefault(require("./theme-mutation-observer"));
/**
 * A React hook which returns the current themes and color-mode set on `<html>`.
 *
 * @example
 * ```
 * const { colorMode, dark, light, spacing, typography } = useThemeObserver();
 *
 * // Performing side effects when it changes
 * useEffect(() => {
 *   console.log(`The color mode has changed to ${theme.colorMode}`);
 * }, [theme.colorMode]);
 * ```
 */
var useThemeObserver = function useThemeObserver() {
  var _useState = (0, _react.useState)((0, _getGlobalTheme.default)()),
    _useState2 = (0, _slicedToArray2.default)(_useState, 2),
    theme = _useState2[0],
    setTheme = _useState2[1];
  (0, _react.useEffect)(function () {
    var observer = new _themeMutationObserver.default(function (theme) {
      return setTheme(theme);
    });
    observer.observe();
    return function () {
      return observer.disconnect();
    };
  }, []);
  return theme;
};
var _default = exports.default = useThemeObserver;