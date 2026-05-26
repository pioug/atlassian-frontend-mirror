import React from 'react';

import { render, screen } from '@testing-library/react';

import Content from '../../internal/shared/content';

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('<Content />', () => {
	describe('plain text content', () => {
		it('should be a span', () => {
			render(<Content text="text" />);
			const content = screen.getByText('text');

			expect(content.tagName).toBe('SPAN');
		});
	});

	describe('link content', () => {
		it('should be a link if it has a href', () => {
			render(<Content href="/somewhere" text="text" />);
			const content = screen.getByText('text');

			expect(content.tagName).toBe('A');
			expect(content).toHaveAttribute('href', '/somewhere');
		});

		it('should set the data-color attribute', () => {
			render(<Content color="green" href="/somewhere" text="text" />);
			const content = screen.getByText('text');

			expect(content.dataset).toHaveProperty('color', 'green');
		});

		it('should use the given linkComponent', () => {
			render(
				<Content linkComponent={(props) => <div {...props} />} href="/somewhere" text="text" />,
			);
			const content = screen.getByText('text');

			expect(content.tagName).toBe('DIV');
			expect(content).toHaveAttribute('href', '/somewhere');
		});

		it('should not have an underline', () => {
			render(<Content href="/somewhere" text="text" />);
			const content = screen.getByText('text');

			expect(content).toHaveCompiledCss({
				textDecorationLine: 'none',
			});
		});
	});
});
