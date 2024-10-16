import React from 'react';
import AISummary from '..';

import { render, screen } from '@testing-library/react';

const markdownBulletList = `
- Item 1
- Item 2
  - Item 2.1
- Item 3
`;

describe('AI Summary', () => {
	it('should not render when content is empty ', () => {
		render(<AISummary content={''} />);

		const aiSummary = screen.queryByTestId('ai-summary');
		expect(aiSummary).toBeNull();
	});

	it('renders markdown bullet list correctly', () => {
		render(<AISummary content={markdownBulletList} />);

		const aiSummary = screen.getByTestId('ai-summary');
		expect(aiSummary).toBeVisible();

		expect(aiSummary.innerHTML.split('\n').join('')).toMatch(
			/<ul class=".*?"><li>Item 1<\/li><li>Item 2<ul class=".*?"><li>Item 2.1<\/li><\/ul><\/li><li>Item 3<\/li><\/ul>/i,
		);
	});

	it('does not render icon by default', async () => {
		render(<AISummary content="test-content" />);

		const icon = screen.queryByTestId('ai-tooltip');
		expect(icon).not.toBeInTheDocument();
	});

	it('does not render summary icon when showIcon is false', async () => {
		render(<AISummary content="test-content" />);

		const icon = screen.queryByTestId('ai-tooltip');
		expect(icon).not.toBeInTheDocument();
	});
});
