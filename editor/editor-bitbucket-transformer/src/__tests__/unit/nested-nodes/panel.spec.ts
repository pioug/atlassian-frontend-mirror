import { MarkdownSerializer, marks, nodes } from '../../../serializer';
import {
  code_block,
  doc,
  panel,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { defaultSchema } from '@atlaskit/editor-test-helpers/schema';

const markdownSerializer = new MarkdownSerializer(nodes, marks);

describe('Unsupported Node: panel', () => {
  it('should throw Unsupported node error for a panel', () => {
    expect(() => {
      markdownSerializer.serialize(
        doc(panel({ type: 'info' })(code_block({})()))(defaultSchema),
      );
    }).toThrow(
      new Error('Token type `panel` not supported by Markdown renderer'),
    );
  });
});
