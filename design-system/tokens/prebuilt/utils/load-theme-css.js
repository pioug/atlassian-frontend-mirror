"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadThemeCss = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _themeImportMap = _interopRequireDefault(require("../artifacts/theme-import-map"));
var loadThemeCss = exports.loadThemeCss = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(themeId) {
    var _yield$themeImportMap, themeCss;
    return _regenerator.default.wrap(function (_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.next = 1;
          return _themeImportMap.default[themeId]();
        case 1:
          _yield$themeImportMap = _context.sent;
          themeCss = _yield$themeImportMap.default;
          return _context.abrupt("return", themeCss);
        case 2:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function loadThemeCss(_x) {
    return _ref.apply(this, arguments);
  };
}();