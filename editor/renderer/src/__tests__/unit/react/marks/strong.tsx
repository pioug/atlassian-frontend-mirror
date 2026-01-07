import React from 'react';
import { render } from '@testing-library/react';
import Strong from '../../../../react/marks/strong';

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('Renderer - React/Marks/Strong', () => {
	const { container } = render(
		<Strong dataAttributes={{ 'data-renderer-mark': true }}>This is strong</Strong>,
	);

	const strongElement = container.querySelector('strong');

	it('should wrap content with <strong>-tag', () => {
		expect(strongElement).toBeInTheDocument();
	});

	it('should output correct html', () => {
		expect(strongElement?.outerHTML).toEqual(
			'<strong data-renderer-mark="true">This is strong</strong>',
		);
	});
});
