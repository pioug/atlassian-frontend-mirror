import {
  pmNodeFactory as factory,
  pmNodeBuilder as builder,
  pmMarkBuilder as markBuilder,
} from '@atlaskit/editor-test-helpers/schema-element-builder';
import { defaultSchema } from '../../../schema';
import * as v1schema from '../../../../json-schema/v1/full.json';
import Ajv from 'ajv';
import { NodeType, MarkType, Node } from 'prosemirror-model';
import { JSONTransformer } from '@atlaskit/editor-json-transformer';

// TODO: We did this change when we bump ajv version 6.
// It will be refactored in this ticket: https://product-fabric.atlassian.net/browse/ED-10888.
/**
 * Check if JSON is valid according to JSON schema.
 */
const ajv = new Ajv({
  schemaId: 'auto',
  meta: false, // optional, to prevent adding draft-06 meta-schema
  extendRefs: true, // optional, current default is to 'fail', spec behaviour is to 'ignore'
  unknownFormats: 'ignore', // optional, current default is true (fail)
});

const metaSchema = require('ajv/lib/refs/json-schema-draft-04.json');
ajv.addMetaSchema(metaSchema);
(ajv._opts as any).defaultMeta = metaSchema.id;

// optional, using unversioned URI is out of spec, see https://github.com/json-schema-org/json-schema-spec/issues/216
(ajv as any)['http://json-schema.org/schema'] =
  'http://json-schema.org/draft-04/schema';

// Optionally you can also disable keywords defined in draft-06
ajv.removeKeyword('propertyNames');
ajv.removeKeyword('contains');
ajv.removeKeyword('const');

const validate = ajv.compile(v1schema);
const isValidJSONSchema = (json: { version: number }) => {
  json.version = 1;
  validate(json);
  return validate.errors === null;
};

const unsupportedNodes = [
  'confluenceUnsupportedBlock',
  'confluenceUnsupportedInline',
  'unsupportedBlock',
  'unsupportedInline',
  'confluenceJiraIssue',
  'unknownBlock',

  // following nodes do not have schema defined
  'image',
  'placeholder',
  'layoutSection',
  'layoutColumn',
  'inlineCard',
  'blockCard',
  'status',
  'embedCard',
];

const unsupportedMarks = [
  'link',
  'breakout',
  'alignment',
  'indentation',
  '__colorGroupDeclaration',
  '__fontStyleGroupDeclaration',
  '__searchQueryGroupDeclaration',
  '__linkGroupDeclaration',
  'confluenceInlineComment',
  'annotation',
  'unsupportedMark',
  'unsupportedNodeAttribute',
  'typeAheadQuery',
];

/**
 * Create an array of all nodes in the schema.
 */
const nodes: NodeType[] = [];
for (const nodeName in defaultSchema.nodes) {
  nodes.push(defaultSchema.nodes[nodeName]);
}

/**
 * Create an array of all marks in the schema.
 */
const marks: MarkType[] = [];
for (const markName in defaultSchema.marks) {
  marks.push(defaultSchema.marks[markName]);
}

/**
 * Create block test data adding marks supported by the block.
 */
const buildWithMarks = (nodeType: NodeType): Function[] => {
  const buildNodes: Function[] = [];
  marks.forEach((mark: MarkType) => {
    if (
      nodeType.allowsMarkType(mark) &&
      unsupportedMarks.indexOf(mark.name) < 0
    ) {
      buildNodes.push(
        (factory as any)[nodeType.name]((markBuilder as any)[mark.name]),
      );
    }
  });
  return buildNodes;
};

/**
 * Create test data for node type up to passed depth.
 */
const getNodeMatches = (
  nodeType: NodeType,
  maxDepth = 0,
  depth = 0,
): Function[] => {
  const matches: Function[] = [];
  nodes.forEach(n => {
    if (
      n.name !== nodeType.name &&
      nodeType.contentMatch.matchType(n) &&
      unsupportedNodes.indexOf(n.name) < 0
    ) {
      if (depth === 0) {
        // if depth is 0 build a child node.
        matches.push((factory as any)[nodeType.name]((builder as any)[n.name]));
      } else if (depth > 0) {
        // if depth is greater than 0 find further child nodes.
        const childNodes = getNodeMatches(n, maxDepth, depth - 1);
        if (childNodes.length === 0) {
          // if child has no further child for instance 'text' node add it.
          matches.push(
            (factory as any)[nodeType.name]((builder as any)[n.name]),
          );
        } else {
          // add all the various combinations of child and its further children.
          matches.push(
            ...childNodes.map(c => (factory as any)[nodeType.name](c)),
          );
        }
      }
    }
  });
  if (nodeType.isBlock) {
    // Add marks if its block on doc level.
    // Checking depth is to ensure testing of mark combination only once and not in nested blocks.
    if (depth === maxDepth - 1) {
      matches.push(...buildWithMarks(nodeType));
    }
    // If its block node with no matching content, just build and return it.
    // This is for cases like 'rule'
    if (matches.length === 0) {
      matches.push((builder as any)[nodeType.name]);
    }
  }
  return matches;
};

/**
 * Generate display name of node adding name of all its children.
 */
const getDisplayName = (node: Node) => {
  if (!node) {
    return '';
  }
  let displayName: string = `${getDisplayName(node.firstChild!)} -> `;
  const markDisplayText =
    node.marks && node.marks.map(mark => mark.type && mark.type.name).join(',');
  if (markDisplayText) {
    displayName += `${markDisplayText} -> `;
  }
  displayName += node.type && node.type.name;
  return displayName;
};

describe('ProseMirror and JSON schema tests', () => {
  // create node test data up to 2 level depths.
  const dataSet = getNodeMatches(defaultSchema.nodes.doc, 4, 4);
  const transformer = new JSONTransformer();

  dataSet.forEach(editorData => {
    const editorDoc = editorData(defaultSchema);
    const editorJson = transformer.encode(editorDoc);
    it(`should validate JSON schema for ${getDisplayName(editorDoc)}`, () => {
      expect(isValidJSONSchema(editorJson)).toEqual(true);
    });
  });
});

/**
 * Attributes __fileName, __fileMimeType etc on media node break tests.
 */
