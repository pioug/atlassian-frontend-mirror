import React from 'react';

import { render, screen } from '@testing-library/react';

import ConfluenceInlineComment from '../../../../react/marks/confluence-inline-comment';

describe('Renderer - React/Marks/ConfluenceInlineComment', () => {
	const create = () =>
		render(
			<ConfluenceInlineComment
				dataAttributes={{ 'data-renderer-mark': true }}
				reference="this-is-reference-hash"
			>
				wrapped text
			</ConfluenceInlineComment>,
		);

	it('should capture and report a11y violations', async () => {
		const { container } = create();

		await expect(container).toBeAccessible();
	});

	it('should wrap content with <span>-tag', () => {
		create();

		expect(screen.getByText('wrapped text').tagName).toBe('SPAN');
	});

	it('should set data-reference to attrs.reference', () => {
		create();

		const mark = screen.getByText('wrapped text');

		expect(mark).toHaveAttribute('data-reference', 'this-is-reference-hash');
		expect(mark).toHaveAttribute('data-mark-type', 'confluenceInlineComment');
	});
});
