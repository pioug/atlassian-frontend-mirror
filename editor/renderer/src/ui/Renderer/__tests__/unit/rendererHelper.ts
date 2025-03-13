import { removeEmptySpaceAroundContent } from '../../rendererHelper';
import type { JSONDocNode } from '@atlaskit/editor-json-transformer';
import { mockCommentData } from '../__fixtures__/mockData';

describe('removeEmptySpaceAroundContent', () => {
	it('should return the same document if content is not an array', () => {
		const document: JSONDocNode = { type: 'doc', content: [], version: 1 };
		expect(removeEmptySpaceAroundContent(document)).toEqual(document);
	});

	it('should return an empty document if there are no paragraphs with content', () => {
		const document: JSONDocNode = {
			type: 'doc',
			content: [
				{ type: 'paragraph', content: [] },
				{ type: 'paragraph', content: [] },
			],
			version: 1,
		};
		const expected: JSONDocNode = { ...document, content: [] };
		expect(removeEmptySpaceAroundContent(document)).toEqual(expected);
	});

	it('should remove empty paragraphs around content', () => {
		const document: JSONDocNode = {
			type: 'doc',
			content: [
				{ type: 'paragraph', content: [] },
				{ type: 'paragraph', content: [] },
				{ type: 'paragraph', content: [{ type: 'text', text: 'Hello' }] },
				{ type: 'paragraph', content: [{ type: 'text', text: 'World' }] },
				{ type: 'paragraph', content: [] },
				{ type: 'paragraph', content: [] },
			],
			version: 1,
		};

		const expected: JSONDocNode = {
			type: 'doc',
			content: [
				{ type: 'paragraph', content: [{ type: 'text', text: 'Hello' }] },
				{ type: 'paragraph', content: [{ type: 'text', text: 'World' }] },
			],
			version: 1,
		};

		expect(removeEmptySpaceAroundContent(document)).toEqual(expected);
	});

	it('should return the same document if all paragraphs have content', () => {
		const document: JSONDocNode = {
			type: 'doc',
			content: [
				{ type: 'paragraph', content: [{ type: 'text', text: 'Hello' }] },
				{ type: 'paragraph', content: [{ type: 'text', text: 'World' }] },
			],
			version: 1,
		};

		expect(removeEmptySpaceAroundContent(document)).toEqual(document);
	});

	it('should handle empty document gracefully', () => {
		const document: JSONDocNode = { type: 'doc', content: [], version: 1 };
		expect(removeEmptySpaceAroundContent(document)).toEqual(document);
	});

	it('should remove paragraphs with only "hardBreak" elements around content', () => {
		const document: JSONDocNode = {
			type: 'doc',
			content: [
				{ type: 'paragraph', content: [{ type: 'hardBreak' }] }, // <br />
				{ type: 'paragraph', content: [{ type: 'hardBreak' }] }, // <br />
				{ type: 'paragraph', content: [{ type: 'text', text: 'Hello' }] },
				{ type: 'paragraph', content: [{ type: 'hardBreak' }] }, // <br />
				{ type: 'paragraph', content: [{ type: 'hardBreak' }] }, // <br />
			],
			version: 1,
		};
		const expected: JSONDocNode = {
			type: 'doc',
			content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Hello' }] }],
			version: 1,
		};
		expect(removeEmptySpaceAroundContent(document)).toEqual(expected);
	});
	it('should keep "hardBreak" elements between text content', () => {
		const document: JSONDocNode = {
			type: 'doc',
			content: [
				{ type: 'paragraph', content: [{ type: 'text', text: 'Hello' }] },
				{ type: 'paragraph', content: [{ type: 'hardBreak' }] }, // <br />
				{ type: 'paragraph', content: [{ type: 'text', text: 'World' }] },
			],
			version: 1,
		};
		const expected: JSONDocNode = {
			type: 'doc',
			content: [
				{ type: 'paragraph', content: [{ type: 'text', text: 'Hello' }] },
				{ type: 'paragraph', content: [{ type: 'hardBreak' }] }, // <br />
				{ type: 'paragraph', content: [{ type: 'text', text: 'World' }] },
			],
			version: 1,
		};
		expect(removeEmptySpaceAroundContent(document)).toEqual(expected);
	});

	it('should remove empty text space around content', () => {
		const document: JSONDocNode = {
			type: 'doc',
			content: [
				{ type: 'paragraph', content: [{ type: 'text', text: ' ' }] },
				{ type: 'paragraph', content: [{ type: 'hardBreak' }] }, // <br />
				{ type: 'paragraph', content: [{ type: 'text', text: 'World' }] },
				{ type: 'paragraph', content: [{ type: 'text', text: '     ' }] },
			],
			version: 1,
		};
		const expected: JSONDocNode = {
			type: 'doc',
			content: [{ type: 'paragraph', content: [{ type: 'text', text: 'World' }] }],
			version: 1,
		};
		expect(removeEmptySpaceAroundContent(document)).toEqual(expected);
	});

	it('should include non-paragraph nodes in the result', () => {
		const document: JSONDocNode = {
			type: 'doc',
			content: mockCommentData,
			version: 1,
		};
		const expected: JSONDocNode = {
			type: 'doc',
			content: mockCommentData.slice(2, mockCommentData.length - 3), // removes the empty paragraphs around the comment content
			version: 1,
		};
		expect(removeEmptySpaceAroundContent(document)).toEqual(expected);
	});
});
