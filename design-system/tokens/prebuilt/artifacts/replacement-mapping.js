"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * This file is intended to help automate renaming of tokens.
 *
 * 1. Mark the old token's 'state' as deprecated
 * 2. Add a 'replacement' attribute to the token with the value 'my.new.token'
 * 3. Create a new token matching the token above: 'my.new.token'
 * 4. Run 'yarn build tokens' to have you changes reflected in this map
 * 5. ESLint and other tools will now use this to automate replacing tokens
 *
 * These changes will then be picked up by our tooling which will attempt to
 * migrate as many of these renames as possible.
 *
 * @codegen <<SignedSource::7ca64db3c8d60ea8d78edec946e325bc>>
 * @codegenCommand yarn build tokens
 */

var replacementMapper = [{
  "path": "border.radius.[default]",
  "state": "deprecated"
}, {
  "path": "border.radius.050",
  "state": "deprecated"
}, {
  "path": "border.radius.100",
  "state": "deprecated"
}, {
  "path": "border.radius.200",
  "state": "deprecated"
}, {
  "path": "border.radius.300",
  "state": "deprecated"
}, {
  "path": "border.radius.400",
  "state": "deprecated"
}, {
  "path": "border.radius.circle",
  "state": "deprecated"
}, {
  "path": "border.width.0",
  "state": "deprecated"
}, {
  "path": "border.width.indicator",
  "state": "deprecated"
}, {
  "path": "border.width.outline",
  "state": "deprecated"
}];
var _default = exports.default = replacementMapper;