import { NodeSpec, MarkSpec, Schema } from 'prosemirror-model';
import { COLOR, FONT_STYLE, SEARCH_QUERY, LINK } from './groups';

import {
  link,
  em,
  strong,
  textColor,
  strike,
  subsup,
  underline,
  code,
  typeAheadQuery,
  confluenceInlineComment,
  breakout,
  alignment,
  indentation,
  annotation,
  unsupportedMark,
  unsupportedNodeAttribute,
  dataConsumer,
} from './marks';

import {
  confluenceJiraIssue,
  confluenceUnsupportedBlock,
  confluenceUnsupportedInline,
  doc,
  paragraph,
  text,
  bulletList,
  orderedList,
  listItem,
  heading,
  blockquote,
  codeBlock,
  panel,
  rule,
  image,
  mention,
  media,
  mediaInline,
  mediaGroup,
  mediaSingle,
  hardBreak,
  emoji,
  table,
  tableCell,
  tableHeader,
  tableRow,
  decisionList,
  decisionItem,
  taskList,
  taskItem,
  unknownBlock,
  extension,
  inlineExtension,
  bodiedExtension,
  date,
  placeholder,
  layoutSection,
  layoutColumn,
  inlineCard,
  blockCard,
  unsupportedBlock,
  unsupportedInline,
  status,
  expand,
  nestedExpand,
  embedCard,
  caption,
} from './nodes';

function addItems(
  builtInItems: SchemaBuiltInItem[],
  config: string[],
  customSpecs: SchemaCustomNodeSpecs | SchemaCustomMarkSpecs = {},
) {
  if (!config) {
    return {};
  }

  /**
   * Add built-in Node / Mark specs
   */
  const items = builtInItems.reduce<Record<string, NodeSpec | MarkSpec>>(
    (items, { name, spec }) => {
      if (config.indexOf(name) !== -1) {
        items[name] = customSpecs[name] || spec;
      }

      return items;
    },
    {},
  );

  /**
   * Add Custom Node / Mark specs
   */
  return Object.keys(customSpecs).reduce((items, name) => {
    if (items[name]) {
      return items;
    }

    items[name] = customSpecs[name];

    return items;
  }, items);
}

// We use groups to allow schemas to be constructed in different shapes without changing node/mark
// specs, but this means nodes/marks are defined with groups that might never be used in the schema.
// In this scenario ProseMirror will complain and prevent the schema from being constructed.
//
// To avoid the problem, we include items that serve to "declare" the groups in the schema. This
// approach unfortunately leaves unused items in the schema, but has the benefit of avoiding the
// need to manipulate `exclude` or content expression values for potentially every schema item.
function groupDeclaration(name: string) {
  return {
    name: `__${name}GroupDeclaration`,
    spec: {
      group: name,
    },
  };
}

const markGroupDeclarations = [
  groupDeclaration(COLOR),
  groupDeclaration(FONT_STYLE),
  groupDeclaration(SEARCH_QUERY),
  groupDeclaration(LINK),
];

const markGroupDeclarationsNames = markGroupDeclarations.map(
  (groupMark) => groupMark.name,
);

const nodesInOrder: SchemaBuiltInItem[] = [
  { name: 'doc', spec: doc },
  { name: 'paragraph', spec: paragraph },
  { name: 'text', spec: text },
  { name: 'bulletList', spec: bulletList },
  { name: 'orderedList', spec: orderedList },
  { name: 'listItem', spec: listItem },
  { name: 'heading', spec: heading },
  { name: 'blockquote', spec: blockquote },
  { name: 'codeBlock', spec: codeBlock },
  { name: 'panel', spec: panel },
  { name: 'rule', spec: rule },
  { name: 'image', spec: image },
  { name: 'mention', spec: mention },
  { name: 'caption', spec: caption },
  { name: 'media', spec: media },
  { name: 'mediaGroup', spec: mediaGroup },
  { name: 'mediaSingle', spec: mediaSingle },
  { name: 'mediaInline', spec: mediaInline },
  { name: 'placeholder', spec: placeholder },
  { name: 'layoutSection', spec: layoutSection },
  { name: 'layoutColumn', spec: layoutColumn },
  { name: 'hardBreak', spec: hardBreak },
  { name: 'emoji', spec: emoji },
  { name: 'table', spec: table },
  { name: 'tableCell', spec: tableCell },
  { name: 'tableRow', spec: tableRow },
  { name: 'tableHeader', spec: tableHeader },
  { name: 'confluenceJiraIssue', spec: confluenceJiraIssue },
  { name: 'confluenceUnsupportedInline', spec: confluenceUnsupportedInline },
  { name: 'confluenceUnsupportedBlock', spec: confluenceUnsupportedBlock },
  { name: 'decisionList', spec: decisionList },
  { name: 'decisionItem', spec: decisionItem },
  { name: 'taskList', spec: taskList },
  { name: 'taskItem', spec: taskItem },
  { name: 'date', spec: date },
  { name: 'status', spec: status },
  { name: 'expand', spec: expand },
  { name: 'nestedExpand', spec: nestedExpand },
  { name: 'extension', spec: extension },
  { name: 'inlineExtension', spec: inlineExtension },
  { name: 'bodiedExtension', spec: bodiedExtension },
  { name: 'inlineCard', spec: inlineCard },
  { name: 'blockCard', spec: blockCard },
  { name: 'embedCard', spec: embedCard },
  { name: 'unknownBlock', spec: unknownBlock },
  { name: 'unsupportedBlock', spec: unsupportedBlock },
  { name: 'unsupportedInline', spec: unsupportedInline },
];

const marksInOrder: SchemaBuiltInItem[] = [
  { name: 'link', spec: link },
  { name: 'em', spec: em },
  { name: 'strong', spec: strong },
  { name: 'textColor', spec: textColor },
  { name: 'strike', spec: strike },
  { name: 'subsup', spec: subsup },
  { name: 'underline', spec: underline },
  { name: 'code', spec: code },
  { name: 'typeAheadQuery', spec: typeAheadQuery },
  { name: 'alignment', spec: alignment },
  { name: 'annotation', spec: annotation },
  { name: 'confluenceInlineComment', spec: confluenceInlineComment },
  ...markGroupDeclarations,
  { name: 'breakout', spec: breakout },
  { name: 'dataConsumer', spec: dataConsumer },
  { name: 'indentation', spec: indentation },
  { name: 'unsupportedMark', spec: unsupportedMark },
  { name: 'unsupportedNodeAttribute', spec: unsupportedNodeAttribute },
];

/**
 * Creates a schema preserving order of marks and nodes.
 */
export function createSchema<
  N extends string = string,
  M extends string = string
>(config: SchemaConfig<N, M>): Schema<N, M> {
  const { customNodeSpecs, customMarkSpecs } = config;
  const nodesConfig = Object.keys(customNodeSpecs || {}).concat(config.nodes);
  const marksConfig = Object.keys(customMarkSpecs || {})
    .concat(config.marks || [])
    .concat(markGroupDeclarationsNames);

  let nodes = addItems(nodesInOrder, nodesConfig, customNodeSpecs) as Record<
    string,
    NodeSpec
  >;
  let marks = addItems(marksInOrder, marksConfig, customMarkSpecs) as Record<
    string,
    MarkSpec
  >;
  nodes = sanitizeNodes(nodes, marks);
  return new Schema<string, string>({
    nodes,
    marks,
  });
}

export function sanitizeNodes(
  nodes: { [key: string]: NodeSpec },
  supportedMarks: { [key: string]: MarkSpec },
): { [key: string]: NodeSpec } {
  const nodeNames = Object.keys(nodes);
  nodeNames.forEach((nodeKey) => {
    const nodeSpec = { ...nodes[nodeKey] };
    if (nodeSpec.marks && nodeSpec.marks !== '_') {
      nodeSpec.marks = nodeSpec.marks
        .split(' ')
        .filter((mark) => !!supportedMarks[mark])
        .join(' ');
    }
    if (nodeSpec.content) {
      nodeSpec.content = sanitizeNodeSpecContent(nodes, nodeSpec.content);
    }
    nodes[nodeKey] = nodeSpec;
  });
  return nodes;
}

export function sanitizeNodeSpecContent(
  nodes: { [key: string]: NodeSpec },
  rawContent: string,
): string {
  const content = rawContent.replace(/\W/g, ' ');
  const contentKeys = content.split(' ');
  const unsupportedContentKeys = contentKeys.filter(
    (contentKey) => !isContentSupported(nodes, contentKey),
  );
  return unsupportedContentKeys.reduce(
    (newContent, nodeName) => sanitizedContent(newContent, nodeName),
    rawContent,
  );
}

function sanitizedContent(
  content: string | undefined,
  invalidContent: string,
): string {
  if (!invalidContent.length) {
    return content || '';
  }

  if (!content || !content.match(/\w/)) {
    return '';
  }

  const pattern = `(${invalidContent}((\\s)*\\|)+)|((\\|(\\s)*)+${invalidContent})|(${invalidContent}$)|(${invalidContent}(\\+|\\*))`;
  return content
    .replace(new RegExp(pattern, 'g'), '')
    .replace('  ', ' ')
    .trim();
}

function isContentSupported(
  nodes: { [key: string]: NodeSpec },
  contentKey: string,
): boolean {
  const nodeKeys = Object.keys(nodes);

  // content is with valid node
  if (nodeKeys.indexOf(contentKey) > -1) {
    return true;
  }

  // content is with valid group
  for (const supportedKey in nodes) {
    const nodeSpec = nodes[supportedKey];
    if (nodeSpec && nodeSpec.group === contentKey) {
      return true;
    }
  }

  return false;
}

export interface SchemaConfig<N = string, M = string> {
  nodes: N[];
  customNodeSpecs?: SchemaCustomNodeSpecs;
  marks?: M[];
  customMarkSpecs?: SchemaCustomMarkSpecs;
}

export interface SchemaBuiltInItem {
  name: string;
  spec: NodeSpec | MarkSpec;
}

export interface SchemaCustomNodeSpecs {
  [name: string]: NodeSpec;
}
export interface SchemaCustomMarkSpecs {
  [name: string]: MarkSpec;
}
