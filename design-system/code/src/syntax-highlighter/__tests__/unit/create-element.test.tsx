import { isValidElement, type ReactElement } from 'react';

import { render } from '@testing-library/react';
import { type AST } from 'refractor';

import createElement from '../../lib/react-renderer/create-element';

// properties
const codeBidiWarningConfig = {
	codeBidiWarnings: true,
	codeBidiWarningTooltipEnabled: true,
};
const key = 'testKey';

// text nodes
const textTestNode: AST.Text = { type: 'text', value: 'text' };
// @ts-expect-error this is used to test graceful handling of numbers
const textWithNumberTestNode: AST.Text = { type: 'text', value: 22 };
const bidiTextTestNode: AST.Text = { type: 'text', value: 'Test‮' };

// element nodes
const elementTestNode: AST.Element = {
	type: 'element',
	tagName: 'span',
	properties: {
		className: ['testClassName', 'testClassName2'],
		style: { maxWidth: '20rem', textAlign: 'center' },
	},
	children: [textTestNode],
};
const elementTestNode2: AST.Element = {
	type: 'element',
	tagName: 'span',
	properties: { className: ['token', 'testClassName'] },
	children: [textTestNode, textWithNumberTestNode],
};

describe('createElement', () => {
	it('should return plain text for text node if it does not contain bidi characters', () => {
		const element = createElement({
			node: textTestNode,
			codeBidiWarningConfig,
			key,
		});

		expect(element).toEqual(textTestNode.value);
	});

	it('should stringify number value inside text node', () => {
		const element = createElement({
			node: textWithNumberTestNode,
			codeBidiWarningConfig,
			key,
		});

		expect(element).toEqual('22');
	});

	it('should return plain text if codeBidiWarnings flag is set to false', () => {
		const element = createElement({
			node: bidiTextTestNode,
			codeBidiWarningConfig: {
				codeBidiWarnings: false,
				codeBidiWarningTooltipEnabled: true,
			},
			key,
		});

		expect(element).toEqual(bidiTextTestNode.value);
	});

	it('should return bidi text warning for mixed direction text node when codeBidiWarnings flag is set to true', () => {
		const element = createElement({
			node: bidiTextTestNode,
			codeBidiWarningConfig,
			key,
		}) as ReactElement[];

		expect(element).toHaveLength(2);
		expect(element[0]).toEqual('Test');
		expect(isValidElement(element[1])).toEqual(true);
	});

	it('should return a react component for element type of node and use specified tag name', () => {
		const element = createElement({
			node: elementTestNode,
			codeBidiWarningConfig,
			key,
		}) as ReactElement;

		const { getByText, container } = render(element);

		expect(container.querySelector('span')).toBeInTheDocument();
		expect(getByText('text')).toBeInTheDocument();
	});

	it('should return a react component containing all node children', () => {
		const element = createElement({
			node: elementTestNode2,
			codeBidiWarningConfig,
			key,
		}) as ReactElement;

		const { getByText } = render(element);

		expect(getByText('text22')).toBeInTheDocument();
	});

	it('should apply element node styles', () => {
		const element = createElement({
			node: elementTestNode,
			codeBidiWarningConfig,
			key,
		}) as ReactElement;

		const { getByText } = render(element);
		const renderedNode = getByText('text');

		expect(renderedNode).toBeInTheDocument();
		expect(renderedNode).toHaveStyle('text-align: center;');
		expect(renderedNode).toHaveStyle('max-width: 20rem;');
	});

	it('should apply element node class names', () => {
		const element = createElement({
			node: elementTestNode,
			codeBidiWarningConfig,
			key,
		}) as ReactElement;

		const { getByText } = render(element);
		const renderedNode = getByText('text');

		expect(renderedNode).toHaveClass('testClassName');
		expect(renderedNode).toHaveClass('testClassName2');
	});
});
