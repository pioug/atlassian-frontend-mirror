import { type AST } from 'refractor';

import createLineGenerator from '../../lib/process/create-line';

const lineNumberNode: AST.Element = {
	children: [],
	properties: {
		className: ['comment', 'linenumber', 'ds-line-number'],
		'data-ds--line-number': 1,
		key: 'line-number--1',
	},
	tagName: 'span',
	type: 'element',
};
const textTestNode: AST.Text = { type: 'text', value: 'text' };
const elementTestNode: AST.Element = {
	type: 'element',
	tagName: 'span',
	properties: [],
	children: [textTestNode],
};

const defaultProps = {
	lineProps: {},
	shouldCreateParentElementForLines: false,
	showLineNumbers: false,
	showInlineLineNumbers: false,
};

describe('createLineGenerator', () => {
	it('should return children array unchanged if no className is passed, and shouldCreateParentElementForLines and showLineNumbers is set to false', () => {
		const generatorFunction = createLineGenerator(
			defaultProps.lineProps,
			defaultProps.shouldCreateParentElementForLines,
			defaultProps.showLineNumbers,
		);

		expect(generatorFunction([textTestNode, elementTestNode], 1)).toEqual([
			textTestNode,
			elementTestNode,
		]);
	});

	it('should return children array unchanged if no className is passed, shouldCreateParentElementForLines is set to false and showLineNumbers is set to true', () => {
		const generatorFunction = createLineGenerator(
			defaultProps.lineProps,
			defaultProps.shouldCreateParentElementForLines,
			true,
		);

		expect(generatorFunction([textTestNode, elementTestNode], 1)).toEqual([
			lineNumberNode,
			textTestNode,
			elementTestNode,
		]);
	});

	it('should return children array unchanged if no className is passed, shouldCreateParentElementForLines is set to false and lineNumber is 0', () => {
		const generatorFunction = createLineGenerator(
			defaultProps.lineProps,
			defaultProps.shouldCreateParentElementForLines,
			defaultProps.showLineNumbers,
		);

		expect(generatorFunction([textTestNode, elementTestNode], 0)).toEqual([
			textTestNode,
			elementTestNode,
		]);
	});

	it('should create line element out of children if shouldCreateParentElementForLines prop is true', () => {
		const generatorFunction = createLineGenerator(
			defaultProps.lineProps,
			true,
			defaultProps.showLineNumbers,
		);

		const functionOutput = generatorFunction([textTestNode, elementTestNode], 1);

		expect(functionOutput).toEqual(
			expect.objectContaining({
				type: 'element',
				tagName: 'span',
				children: [textTestNode, elementTestNode],
			}),
		);
	});

	it('should create line element out of children and append className to properties if className array is passed', () => {
		const generatorFunction = createLineGenerator(
			defaultProps.lineProps,
			defaultProps.shouldCreateParentElementForLines,
			defaultProps.showLineNumbers,
		);

		const functionOutput = generatorFunction([textTestNode, elementTestNode], 1, [
			'testClassName',
			'testClassName2',
		]) as AST.Element;

		expect(functionOutput).toEqual(
			expect.objectContaining({
				type: 'element',
				tagName: 'span',
				children: [textTestNode, elementTestNode],
			}),
		);
		expect(functionOutput.properties.className).toEqual(['testClassName', 'testClassName2']);
	});

	it('should add line number element inline if showLineNumbers flags are true', () => {
		const generatorFunction = createLineGenerator(
			defaultProps.lineProps,
			defaultProps.shouldCreateParentElementForLines,
			true,
		);

		const functionOutput = generatorFunction([textTestNode, elementTestNode], 1) as AST.Element[];

		expect(functionOutput).toHaveLength(3);
		expect(functionOutput[0]).toEqual(lineNumberNode);
		expect(functionOutput[0].properties['data-ds--line-number']).toEqual(1);
		expect(functionOutput[1]).toEqual(textTestNode);
		expect(functionOutput[2]).toEqual(elementTestNode);
	});
});
