import { Schema } from '@atlaskit/editor-prosemirror/model';
import { createSchema } from './create-schema';

/**
 * @deprecated [ED-15676] We have stopped supporting product specific schemas. Use `@atlaskit/adf-schema/schema-default` instead.
 **/
export const bitbucketSchema: Schema = createSchema({
  nodes: [
    'doc',
    'caption',
    'paragraph',
    'text',
    'bulletList',
    'orderedList',
    'listItem',
    'heading',
    'blockquote',
    'codeBlock',
    'hardBreak',
    'rule',
    'image',
    'media',
    'mediaSingle',
    'mention',
    'emoji',
    'table',
    'tableCell',
    'tableHeader',
    'tableRow',
    'inlineCard',
    'unsupportedBlock',
    'unsupportedInline',
  ],
  marks: [
    'em',
    'strong',
    'strike',
    'link',
    'code',
    'unsupportedMark',
    'unsupportedNodeAttribute',
  ],
});
