import { type AST } from 'refractor';

import createLineElement, {
	type CreateLineElementProps,
} from '../../lib/process/create-line-element';

const lineNumberNode: AST.Element = {
	children: [],
	properties: {
		className: ['comment', 'linenumber', 'ds-line-number'],
		'data-ds--line-number': 5,
		key: 'line-number--5',
	},
	tagName: 'span',
	type: 'element',
};
const textTestNode: AST.Text = { type: 'text', value: 'text' };
const textTestNode2: AST.Text = { type: 'text', value: 'text2' };

describe('createLineElement', () => {
	it('should return line element data', () => {
		const props: CreateLineElementProps = {
			lineNumber: 0,
			children: [],
		};

		const lineElement = createLineElement(props);

		expect(lineElement).toEqual({
			type: 'element',
			tagName: 'span',
			properties: { className: [] },
			children: [],
		});
	});

	it('should append passed class names to line element properties', () => {
		const props: CreateLineElementProps = {
			lineNumber: 0,
			children: [],
			className: ['testClassName', 'testClassName2'],
		};

		const lineElement = createLineElement(props);

		expect(lineElement.properties).toEqual({
			className: ['testClassName', 'testClassName2'],
		});
	});

	it('should append passed class names in addition to existing line element properties', () => {
		const props: CreateLineElementProps = {
			lineNumber: 0,
			children: [],
			className: ['testClassName', 'testClassName2'],
			lineProps: { display: 'inline-block', textAlign: 'right' },
		};

		const lineElement = createLineElement(props);

		expect(lineElement.properties).toEqual(
			expect.objectContaining({
				className: ['testClassName', 'testClassName2'],
				display: 'inline-block',
				textAlign: 'right',
			}),
		);
	});

	it('should call lineProps with lineNumber if its type is function', () => {
		const props: CreateLineElementProps = {
			lineNumber: 3,
			children: [],
			className: ['testClassName'],
			lineProps: (lineNumber: number) => ({
				minWidth: `${lineNumber < 9 ? '2em' : '1em'}`,
			}),
		};

		const lineElement = createLineElement(props);

		expect(lineElement.properties.className).toEqual(['testClassName']);
		expect(lineElement.properties.minWidth).toEqual('2em');
	});

	it('should return unchanged children if no lineNumber passed', () => {
		const props: CreateLineElementProps = {
			lineNumber: 0,
			children: [textTestNode],
			shouldShowLineNumbers: true,
		};

		const lineElement = createLineElement(props);

		expect(lineElement.children).toEqual([textTestNode]);
	});

	it('should return unchanged children if shouldShowLineNumbers is false', () => {
		const props: CreateLineElementProps = {
			lineNumber: 5,
			children: [textTestNode],
			shouldShowLineNumbers: false,
		};

		const lineElement = createLineElement(props);

		expect(lineElement.children).toEqual([textTestNode]);
	});

	it('should prepend line number node at the beginning of children array if a single child passed', () => {
		const props: CreateLineElementProps = {
			lineNumber: 5,
			children: [textTestNode],
			shouldShowLineNumbers: true,
		};

		const lineElement = createLineElement(props);
		expect(lineElement.children).toHaveLength(2);
		expect(lineElement.children[0]).toEqual(lineNumberNode);
		expect(lineElement.children[1]).toEqual(textTestNode);
	});

	it('should prepend line number node to a children array and nest children one layer deeper if multiple children are passed', () => {
		const props: CreateLineElementProps = {
			lineNumber: 5,
			children: [textTestNode, textTestNode2],
			shouldShowLineNumbers: true,
			className: ['testClassName'],
		};

		const lineElement = createLineElement(props);

		expect(lineElement.children).toHaveLength(2);
		expect(lineElement.properties).toEqual({ className: ['testClassName'] });
		expect(lineElement.children[0]).toEqual(lineNumberNode);
		expect(lineElement.children[1]).toEqual(
			expect.objectContaining({
				type: 'element',
				tagName: 'span',
				properties: { className: [] },
			}),
		);
		// @ts-expect-error
		expect(lineElement.children[1].children).toEqual([textTestNode, textTestNode2]);
	});
});
