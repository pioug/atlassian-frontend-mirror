import React from 'react';
import { render, screen } from '@testing-library/react';
import DataConsumer from '../../../../react/marks/data-consumer';

describe('Renderer - React/Marks/DataConsumer', () => {
	const sourcesArr = ['foo', 'bar'];
	const create = (inline: boolean = false) =>
		render(
			<DataConsumer
				isInline={inline}
				sources={sourcesArr}
				dataAttributes={{ 'data-renderer-mark': true }}
				reference="this-is-reference-hash"
			>
				wrapped text
			</DataConsumer>,
		);

	it('should capture and report a11y violations', async () => {
		const { container } = create();

		await expect(container).toBeAccessible();
	});

	it('should wrap content with <div>-tag', () => {
		create();

		expect(screen.getByText('wrapped text').tagName).toBe('DIV');
	});

	it('should wrap content with <span>-tag when inline', () => {
		create(true);

		expect(screen.getByText('wrapped text').tagName).toBe('SPAN');
	});

	it('should set data-source to attrs.sources', () => {
		create();

		const mark = screen.getByText('wrapped text');

		expect(mark).toHaveAttribute('data-source', JSON.stringify(sourcesArr));
		expect(mark).toHaveAttribute('data-mark-type', 'dataConsumer');
	});
});
