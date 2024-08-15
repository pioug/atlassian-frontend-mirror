import { MarkdownSerializer, marks, nodes } from '../../../serializer';
import { doc, p, expand, nestedExpand } from '@atlaskit/editor-test-helpers/doc-builder';
import { defaultSchema } from '@atlaskit/editor-test-helpers/schema';

const markdownSerializer = new MarkdownSerializer(nodes, marks);

describe('Unsupported nodes: expand, nestedExpand', () => {
	it('should throw unsupported node error for a expand', () => {
		expect(() => {
			markdownSerializer.serialize(
				doc(
					expand({ title: 'Parent title' })(
						p('Parent content'),
						nestedExpand({ title: 'Child title' })(p('Child content')),
					),
				)(defaultSchema),
			);
		}).toThrow(new Error('Token type `expand` not supported by Markdown renderer'));
	});
});
