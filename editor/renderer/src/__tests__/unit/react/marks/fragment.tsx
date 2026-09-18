import React from 'react';

import { render, screen } from '@testing-library/react';

import FragmentMark from '../../../../react/marks/fragment';

describe('Renderer - React/Marks/Fragment', () => {
	const createMarkElement = (isInline: boolean) =>
		render(
			<FragmentMark
				isInline={isInline}
				localId="test-local-id"
				name="test-fragment-name"
				dataAttributes={{ 'data-renderer-mark': true }}
				reference="this-is-reference-hash"
			>
				wrapped text
			</FragmentMark>,
		);

	it('should capture and report a11y violations', async () => {
		const { container } = createMarkElement(false);

		await expect(container).toBeAccessible();
	});

	it('should wrap content with <div>-tag for block elements', () => {
		createMarkElement(false);

		expect(screen.getByText('wrapped text').tagName).toBe('DIV');
	});

	it('should wrap content with <span>-tag for inline elements', () => {
		createMarkElement(true);

		expect(screen.getByText('wrapped text').tagName).toBe('SPAN');
	});

	it('should set data-localId to attrs.localId', () => {
		createMarkElement(false);

		const mark = screen.getByText('wrapped text');

		expect(mark).toHaveAttribute('data-name', 'test-fragment-name');
		expect(mark).toHaveAttribute('data-localId', 'test-local-id');
		expect(mark).toHaveAttribute('data-mark-type', 'fragment');
	});
});
