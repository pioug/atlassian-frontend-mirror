"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tokenOrder = void 0;
/**
 * Create specific rules for ordering tokens based on their root path and subpath.
 */
var tokenOrder = exports.tokenOrder = [{
  path: 'color',
  subpaths: ['text', 'link', 'icon', 'border', 'background', 'blanket', 'interaction', 'skeleton', 'chart',
  // deleted ↓
  'accent', 'iconBorder', 'overlay']
}, {
  path: 'elevation',
  subpaths: ['surface', 'shadow']
}, {
  path: 'opacity',
  subpaths: []
}, {
  path: 'shadow',
  subpaths: ['card', 'overlay']
},
// Deleted
{
  path: 'utility',
  subpaths: []
}, {
  path: 'border',
  subpaths: ['radius', 'width']
}, {
  path: 'space',
  subpaths: []
}, {
  path: 'font',
  subpaths: ['heading', 'body', 'code', 'weight', 'family', 'size', 'lineHeight']
}, {
  path: 'value',
  // Legacy palette
  subpaths: []
}];