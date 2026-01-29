import React from 'react';
import { render } from '@testing-library/react';
import Paragraph from '../../../../react/nodes/paragraph';
import ReactSerializer from '../../../../react';

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

	it('should render <br> tags in empty paragraphs', () => {
		const { container } = render(
			<>
				<Paragraph
					marks={[]}
					serializer={serialiser}
					nodeType="paragraph"
					dataAttributes={{ 'data-renderer-start-pos': 0 }}
				/>
				<Paragraph
					marks={[]}
					serializer={serialiser}
					nodeType="paragraph"
					dataAttributes={{ 'data-renderer-start-pos': 1 }}
				>
					This is a paragraph
				</Paragraph>
				<Paragraph
					marks={[]}
					serializer={serialiser}
					nodeType="paragraph"
					dataAttributes={{ 'data-renderer-start-pos': 19 }}
				/>
			</>,
		);

		const paragraphs = container.querySelectorAll('p');

		expect(paragraphs[0].innerHTML).toEqual('&nbsp;');
		expect(paragraphs[0]).toHaveAttribute('data-renderer-start-pos', '0');
		expect(paragraphs[2].innerHTML).toEqual('&nbsp;');
		expect(paragraphs[2]).toHaveAttribute('data-renderer-start-pos', '19');
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
