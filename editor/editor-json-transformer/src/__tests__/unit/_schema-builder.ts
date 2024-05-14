import { createSchema } from '@atlaskit/adf-schema';
import type { Schema } from '@atlaskit/editor-prosemirror/model';

export const schema: Schema = createSchema({
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
    'rule',
  ],
  marks: ['em', 'strong', 'code', 'strike', 'underline', 'textColor', 'backgroundColor'],
});
