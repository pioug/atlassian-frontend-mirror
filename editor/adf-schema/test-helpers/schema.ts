import {
  AttributeSpec,
  MarkSpec,
  Node,
  NodeSpec,
  ParseRule,
  Schema,
} from 'prosemirror-model';
import { paragraph, createSchema } from '../src/schema';

export { Node, Schema };
export type { AttributeSpec, MarkSpec, NodeSpec, ParseRule };
export default createSchema({
  nodes: [
    'doc',
    'paragraph',
    'text',
    'bulletList',
    'orderedList',
    'listItem',
    'heading',
    'blockquote',
    'codeBlock',
    'panel',
    'rule',
    'hardBreak',
    'mention',
    'emoji',
    'image',
    'caption',
    'media',
    'mediaGroup',
    'confluenceUnsupportedBlock',
    'confluenceUnsupportedInline',
    'confluenceJiraIssue',
    'mediaSingle',
    'plain',
    'table',
    'tableCell',
    'tableHeader',
    'tableRow',
    'decisionList',
    'decisionItem',
    'taskList',
    'taskItem',
    'extension',
    'inlineExtension',
    'bodiedExtension',
    'date',
    'status',
    'unknownBlock',
    'placeholder',
    'inlineCard',
    'blockCard',
    'embedCard',
    'expand',
    'nestedExpand',
    'unsupportedBlock',
    'unsupportedInline',
  ],
  marks: [
    'em',
    'strong',
    'code',
    'strike',
    'underline',
    'link',
    'subsup',
    'textColor',
    'unsupportedMark',
    'unsupportedNodeAttribute',
    'annotation',
    'dataConsumer',
  ],
  customNodeSpecs: {
    plain: { ...paragraph, content: 'text*', marks: '' },
  },
});
