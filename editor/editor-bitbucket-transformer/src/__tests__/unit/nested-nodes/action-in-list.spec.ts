import { MarkdownSerializer, marks, nodes } from '../../../serializer';
import { doc, li, ul, p, taskItem, taskList } from '@atlaskit/editor-test-helpers/doc-builder';
import { defaultSchema } from '@atlaskit/editor-test-helpers/schema';

const markdownSerializer = new MarkdownSerializer(nodes, marks);

describe('Unsupported Node: taskList', () => {
	it('should throw Unsupported node error for a taskList', () => {
		expect(() => {
			markdownSerializer.serialize(
				doc(
					ul(
						li(p('A '), taskList({})(taskItem({ state: 'TODO' })('action item'))),
						li(p('B')),
						li(p('C')),
					),
				)(defaultSchema),
			);
		}).toThrow(new Error('Token type `taskList` not supported by Markdown renderer'));
	});
});
