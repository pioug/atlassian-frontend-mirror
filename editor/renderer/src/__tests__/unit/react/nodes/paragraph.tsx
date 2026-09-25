import React from 'react';

import { render } from '@testing-library/react';

import ReactSerializer from '../../../../react';
import Paragraph from '../../../../react/nodes/paragraph';

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('Renderer - React/Nodes/Paragraph', () => {
	const serialiser = new ReactSerializer({});

	it('should wrap content with <p>-tag', () => {
		const { container } = render(
			<Paragraph
				marks={[]}
				serializer={serialiser}
				nodeType="paragraph"
				dataAttributes={{ 'data-renderer-start-pos': 0 }}
			>
				This is a paragraph
			</Paragraph>,
		);
		expect(container.querySelector('p')).toBeInTheDocument();
	});

	const renderEmptyAndFilledParagraphs = (plainTextFastPath?: boolean) =>
		render(
			<>
				<Paragraph
					marks={[]}
					serializer={serialiser}
					nodeType="paragraph"
					dataAttributes={{ 'data-renderer-start-pos': 0 }}
					plainTextFastPath={plainTextFastPath}
				/>
				<Paragraph
					marks={[]}
					serializer={serialiser}
					nodeType="paragraph"
					dataAttributes={{ 'data-renderer-start-pos': 1 }}
					plainTextFastPath={plainTextFastPath}
				>
					This is a paragraph
				</Paragraph>
				<Paragraph
					marks={[]}
					serializer={serialiser}
					nodeType="paragraph"
					dataAttributes={{ 'data-renderer-start-pos': 19 }}
					plainTextFastPath={plainTextFastPath}
				/>
			</>,
		);

	const expectEmptyParagraphsRendered = (container: HTMLElement) => {
		const paragraphs = container.querySelectorAll('p');

		expect(paragraphs[0].innerHTML).toEqual('&nbsp;');
		expect(paragraphs[0]).toHaveAttribute('data-renderer-start-pos', '0');
		expect(paragraphs[2].innerHTML).toEqual('&nbsp;');
		expect(paragraphs[2]).toHaveAttribute('data-renderer-start-pos', '19');
	};

	// Both branches must keep the non-breaking space in empty paragraphs. The branch is selected
	// by the prop that `ReactSerializer` threads down, not by reading the experiment here.
	it.each([
		['fast path prop set', true],
		['fast path prop unset', undefined],
	])('should render &nbsp; in empty paragraphs with %s', (_label, plainTextFastPath) => {
		expectEmptyParagraphsRendered(renderEmptyAndFilledParagraphs(plainTextFastPath).container);
	});

	it('should render data-as-inline attribute when asInline is on', () => {
		const screen = render(
			<Paragraph
				marks={[]}
				serializer={serialiser}
				nodeType="paragraph"
				dataAttributes={{ 'data-renderer-start-pos': 0 }}
				asInline="on"
			>
				This is an inline paragraph
			</Paragraph>,
		);

		const paragraph = screen.getByText('This is an inline paragraph');
		expect(paragraph).toHaveAttribute('data-as-inline', 'on');
	});

	it('should not render data-as-inline attribute when asInline is not provided', () => {
		const screen = render(
			<Paragraph
				marks={[]}
				serializer={serialiser}
				nodeType="paragraph"
				dataAttributes={{ 'data-renderer-start-pos': 0 }}
			>
				This is a regular paragraph
			</Paragraph>,
		);

		const paragraph = screen.getByText('This is a regular paragraph');
		expect(paragraph).not.toHaveAttribute('data-as-inline');
	});
});
