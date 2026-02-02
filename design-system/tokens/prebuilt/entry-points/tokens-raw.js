"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "dark", {
  enumerable: true,
  get: function get() {
    return _atlassianDark.default;
  }
});
Object.defineProperty(exports, "light", {
  enumerable: true,
  get: function get() {
    return _atlassianLight.default;
  }
});
Object.defineProperty(exports, "shape", {
  enumerable: true,
  get: function get() {
    return _atlassianShape.default;
  }
});
Object.defineProperty(exports, "spacing", {
  enumerable: true,
  get: function get() {
    return _atlassianSpacing.default;
  }
});
Object.defineProperty(exports, "typography", {
  enumerable: true,
  get: function get() {
    return _atlassianTypography.default;
  }
});
var _atlassianLight = _interopRequireDefault(require("../artifacts/tokens-raw/atlassian-light"));
var _atlassianDark = _interopRequireDefault(require("../artifacts/tokens-raw/atlassian-dark"));
var _atlassianSpacing = _interopRequireDefault(require("../artifacts/tokens-raw/atlassian-spacing"));
var _atlassianTypography = _interopRequireDefault(require("../artifacts/tokens-raw/atlassian-typography"));
var _atlassianShape = _interopRequireDefault(require("../artifacts/tokens-raw/atlassian-shape"));