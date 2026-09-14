"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.moreContrastMediaQuery = exports.loadAndAppendThemeCss = exports.darkModeMediaQuery = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _constants = require("../constants");
var _loadThemeCss = require("./load-theme-css");
var loadAndAppendThemeCss = exports.loadAndAppendThemeCss = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(themeId, preloadedThemeCss) {
    var themeCss, style, _t;
    return _regenerator.default.wrap(function (_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          if (!document.head.querySelector("style[".concat(_constants.THEME_DATA_ATTRIBUTE, "=\"").concat(themeId, "\"]:not([").concat(_constants.CUSTOM_THEME_ATTRIBUTE, "])"))) {
            _context.next = 1;
            break;
          }
          return _context.abrupt("return");
        case 1:
          if (themeId) {
            _context.next = 2;
            break;
          }
          return _context.abrupt("return");
        case 2:
          if (!(preloadedThemeCss !== null && preloadedThemeCss !== void 0)) {
            _context.next = 3;
            break;
          }
          _t = preloadedThemeCss;
          _context.next = 5;
          break;
        case 3:
          _context.next = 4;
          return (0, _loadThemeCss.loadThemeCss)(themeId);
        case 4:
          _t = _context.sent;
        case 5:
          themeCss = _t;
          style = document.createElement('style');
          style.textContent = themeCss;
          style.dataset.theme = themeId;
          document.head.appendChild(style);
        case 6:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function loadAndAppendThemeCss(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
var darkModeMediaQuery = exports.darkModeMediaQuery = '(prefers-color-scheme: dark)';
var moreContrastMediaQuery = exports.moreContrastMediaQuery = '(prefers-contrast: more)';