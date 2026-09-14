import { render } from '@testing-library/react';
import React from 'react';
import { HighlightText, type Props } from '../../../components/HighlightText';

describe('HighlightText', () => {
	const text = 'Some text';
	const renderHighlightText = (props: Partial<Props> = {}) =>
		render(<HighlightText {...props}>{text}</HighlightText>);

	const expectHighlightedParts = (highlights: Props['highlights'], expected: string[]) => {
		const { container } = renderHighlightText({ highlights });

		expect(container).toHaveTextContent(text);
		expect(Array.from(container.querySelectorAll('b')).map((part) => part.textContent)).toEqual(
			expected,
		);
	};

	it('renders plain text when no highlight configuration is supplied', async () => {
		const { container } = renderHighlightText();

		expect(container).toHaveTextContent(text);
		expect(container.querySelector('b')).not.toBeInTheDocument();
		await expect(document.body).toBeAccessible();
	});

	it('does not highlight anything with an empty highlights array', () => {
		expectHighlightedParts([], []);
	});

	it('highlights all the text', () => {
		expectHighlightedParts([{ start: 0, end: 9 }], [text]);
	});

	it('highlights multiple parts', () => {
		expectHighlightedParts(
			[
				{ start: 0, end: 1 },
				{ start: 3, end: 4 },
			],
			['So', 'e '],
		);
	});

	it('does not duplicate text with overlapping intervals', () => {
		expectHighlightedParts(
			[
				{ start: 0, end: 3 },
				{ start: 2, end: 4 },
			],
			['Some '],
		);
	});

	it('renders out-of-order highlights in text order', () => {
		expectHighlightedParts(
			[
				{ start: 5, end: 7 },
				{ start: 0, end: 2 },
			],
			['Som', 'tex'],
		);
	});

	it('does not break with contained intervals', () => {
		expectHighlightedParts(
			[
				{ start: 0, end: 5 },
				{ start: 1, end: 4 },
			],
			['Some t'],
		);
	});

	it('joins contiguous intervals', () => {
		expectHighlightedParts(
			[
				{ start: 0, end: 2 },
				{ start: 3, end: 5 },
			],
			['Some t'],
		);
	});

	it('does not break with intervals outside the text bounds', () => {
		expectHighlightedParts(
			[
				{ start: -1, end: 2 },
				{ start: 5, end: 15 },
			],
			['Som', 'text'],
		);
	});

	it('highlights all text with two contiguous out-of-bounds intervals', () => {
		expectHighlightedParts(
			[
				{ start: -1, end: 3 },
				{ start: 4, end: 15 },
			],
			[text],
		);
	});

	it('does not add a highlight when start is greater than end', () => {
		expectHighlightedParts([{ start: 1, end: 0 }], []);
	});

	it('does not add a highlight when start and end are equal', () => {
		expectHighlightedParts([{ start: 1, end: 1 }], []);
	});
});
