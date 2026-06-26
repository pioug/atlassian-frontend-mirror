import refractor from 'refractor';

import __noop from '@atlaskit/ds-lib/noop';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import flattenCodeTree from '../../lib/process/flatten-code-tree';
import getCodeTree from '../../lib/process/get-code-tree';
import { type RefractorNode } from '../../types';

const codeLine = 'int num = 21';

const extractText = (nodes: RefractorNode[]): string =>
	nodes
		.map((node) => {
			if (node.type === 'text') {
				return node.value;
			}

			return node.children ? extractText(node.children) : '';
		})
		.join('');

describe('getCodeTree', () => {
	it('should return unformatted code tree if language is "text" type', () => {
		const codeTree = getCodeTree('text', codeLine);

		expect(codeTree).toEqual([{ type: 'text', value: codeLine }]);
	});

	it('should return unformatted code tree if refractor library thrown an error', () => {
		const mock = jest.spyOn(refractor, 'highlight').mockImplementationOnce(() => {
			throw new Error();
		});

		const codeTree = getCodeTree('java', codeLine, refractor);

		expect(mock).toBeCalledTimes(1);
		expect(mock).toThrow(Error);
		expect(codeTree).toEqual([{ type: 'text', value: codeLine }]);

		mock.mockRestore();
	});

	it('should return formatted code tree if valid language and astGenerator is passed', () => {
		const codeTree = getCodeTree('java', codeLine, refractor);

		expect(codeTree).toHaveLength(5);
		expect(codeTree[0]).toEqual(
			expect.objectContaining({
				type: 'element',
				tagName: 'span',
				children: [
					{
						type: 'text',
						value: 'int',
					},
				],
			}),
		);
	});

	describe('markdown with platform-code-highlight-markdown-safe gate', () => {
		const markdownWithJsx = '```python\nconst x = <div className="foo">hello</div>;\n```';

		it('should preserve HTML/JSX tags in markdown fenced blocks when gate is on', () => {
			passGate('platform-code-highlight-markdown-safe');

			const codeTree = getCodeTree('markdown', markdownWithJsx, refractor);
			const allText = extractText(codeTree);
			const serializedTree = JSON.stringify(codeTree);

			expect(allText).toContain('<div');
			expect(allText).toContain('</div>');
			expect(serializedTree).toContain('language-python');
			expect(serializedTree).toContain('code-block');
		});

		it('should use default refractor markdown highlighting when gate is off', () => {
			failGate('platform-code-highlight-markdown-safe');

			const codeTree = getCodeTree('markdown', markdownWithJsx, refractor);

			expect(codeTree.length).toBeGreaterThan(0);
		});

		it('should trim fenced sub-language before checking whether it is registered', () => {
			passGate('platform-code-highlight-markdown-safe');

			const codeTree = getCodeTree(
				'markdown',
				'```jsx   \nconst x = <div>hello</div>;\n```',
				refractor,
			);
			const allText = extractText(codeTree);
			const serializedTree = JSON.stringify(codeTree);

			expect(allText).toContain('<div>');
			expect(allText).toContain('</div>');
			expect(serializedTree).toContain('language-jsx');
			expect(serializedTree).toContain('code-block');
		});

		it('should restore markdown grammar atomically if markdown highlighting throws', () => {
			passGate('platform-code-highlight-markdown-safe');

			const codeBlockGrammar = {};
			const originalInside = { 'code-block': codeBlockGrammar, other: true };
			const markdownCodeToken: Array<{ inside?: typeof originalInside }> = [
				{},
				{ inside: originalInside },
			];
			const observedInsideDuringHighlight: Array<typeof originalInside | undefined> = [];
			const astGenerator = {
				languages: {
					markdown: {
						code: markdownCodeToken,
					},
				},
				highlight: jest.fn(() => {
					observedInsideDuringHighlight.push(markdownCodeToken[1].inside);
					throw new Error('markdown highlight failed');
				}),
			};

			const codeTree = getCodeTree('markdown', markdownWithJsx, astGenerator);

			expect(codeTree).toEqual([{ type: 'text', value: markdownWithJsx }]);
			expect(observedInsideDuringHighlight).toHaveLength(1);
			expect(observedInsideDuringHighlight[0]).not.toBe(originalInside);
			expect(observedInsideDuringHighlight[0]).toEqual({ other: true });
			expect(markdownCodeToken[1].inside).toBe(originalInside);
			expect(markdownCodeToken[1].inside?.['code-block']).toBe(codeBlockGrammar);
		});
	});

	describe('class reset for fenced block inside markdown', () => {
		const markdownWithFencedJsx = [
			'```jsx',
			'<div>',
			'  <p>',
			'\tThis is a paragraph',
			'  </p>',
			'</div>',
			'```',
		].join('\n');

		it('flattened nodes for plain text inside fenced JSX block should NOT inherit outer markdown token classes', () => {
			passGate('platform-code-highlight-markdown-safe');

			const codeTree = getCodeTree('markdown', markdownWithFencedJsx, refractor);
			const flattened = flattenCodeTree(codeTree);

			// Find every flattened node whose text child contains "This is a paragraph"
			const paragraphNodes = flattened.filter((node) => {
				if (node.type !== 'element') {
					return false;
				}
				const text = JSON.stringify(node.children);
				return text.includes('This is a paragraph');
			});

			expect(paragraphNodes.length).toBeGreaterThan(0);

			paragraphNodes.forEach((node) => {
				if (node.type !== 'element') {
					return;
				}
				const classes: string[] = node.properties?.className ?? [];
				const classStr = classes.join(' ');

				expect(classStr).not.toMatch(/\btoken\b.*\btoken\b/);
				expect(classStr).not.toContain('code-block');
				expect(classStr).not.toContain('code ');
			});
		});
	});
});
