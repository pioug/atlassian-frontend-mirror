import { createSchema } from './create-schema';
import { Schema } from '@atlaskit/editor-prosemirror/model';

const nodes = [
  'doc',
  'paragraph',
  'blockquote',
  'codeBlock',
  'panel',
  'hardBreak',
  'orderedList',
  'bulletList',
  'heading',
  'mediaInline',
  'mediaGroup',
  'mediaSingle',
  'media',
  'caption',
  'confluenceUnsupportedBlock',
  'confluenceJiraIssue',
  'expand',
  'nestedExpand',
  'extension',
  'inlineExtension',
  'bodiedExtension',
  'listItem',
  'mention',
  'text',
  'confluenceUnsupportedInline',
  'media',
  'rule',
  'table',
  'tableCell',
  'tableHeader',
  'tableRow',
  'emoji',
  'taskList',
  'taskItem',
  'date',
  'placeholder',
  'decisionList',
  'decisionItem',
  'layoutSection',
  'layoutColumn',
  'inlineCard',
  'unsupportedBlock',
  'unsupportedInline',
];

const marks = [
  'link',
  'em',
  'strong',
  'strike',
  'subsup',
  'underline',
  'mentionQuery',
  'code',
  'textColor',
  'confluenceInlineComment',
  'annotation',
  'unsupportedMark',
  'unsupportedNodeAttribute',
];

/**
 * @deprecated [ED-15676] We have stopped supporting product specific schemas. Use `@atlaskit/adf-schema/schema-default` instead.
 **/
export const confluenceSchema: Schema = createSchema({ nodes, marks });
/**
 * @deprecated [ED-15676] We have stopped supporting product specific schemas. Use `@atlaskit/adf-schema/schema-default` instead.
 **/
export const confluenceSchemaWithMediaSingle: Schema = createSchema({
  nodes: nodes.concat('mediaSingle'),
  marks,
});
