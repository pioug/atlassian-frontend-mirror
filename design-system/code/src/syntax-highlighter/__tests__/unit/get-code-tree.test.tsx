import refractor from 'refractor';

import __noop from '@atlaskit/ds-lib/noop';

import getCodeTree from '../../lib/process/get-code-tree';

const codeLine = 'int num = 21';

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
});
