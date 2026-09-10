import React from 'react';
import { MarkdownLink } from '../../markdown-link';
import { render, screen } from '@atlassian/testing-library';

describe('MarkdownLink', () => {
	it('should capture and report a11y violations', async () => {
		const { container } = render(
			<MarkdownLink href="https://www.atlassian.design">Atlassian Design</MarkdownLink>,
		);
		await expect(container).toBeAccessible();
	});

	it('should render a link', () => {
		render(<MarkdownLink href="https://www.atlassian.design">Atlassian Design</MarkdownLink>);
		const link = screen.getByRole('link');
		expect(link).toBeVisible();
		expect(link).toHaveAttribute('href', 'https://www.atlassian.design');
	});

	it('should have the target attribute set to _blank for external links', () => {
		render(<MarkdownLink href="https://www.atlassian.design">Atlassian Design</MarkdownLink>);
		const link = screen.getByRole('link');
		expect(link).toHaveAttribute('target', '_blank');
	});

	it('should not set the target attribute for internal links', () => {
		render(<MarkdownLink href="/packages/design-system/link">Link</MarkdownLink>);
		const link = screen.getByRole('link');
		expect(link).not.toHaveAttribute('target');
	});

	it('should not set the target attribute for links to hash anchors', () => {
		render(<MarkdownLink href="#anchor">Link</MarkdownLink>);
		const link = screen.getByRole('link');
		expect(link).not.toHaveAttribute('target');
	});
});
