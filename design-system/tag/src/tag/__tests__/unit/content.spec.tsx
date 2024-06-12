import React from 'react';

import { render } from '@testing-library/react';

import Content from '../../internal/shared/content';

describe('<Content />', () => {
	describe('plain text content', () => {
		it('should be a span', () => {
			const { getByText } = render(<Content text="text" />);
			const content = getByText('text');

			expect(content.tagName).toBe('SPAN');
		});
	});

	describe('link content', () => {
		it('should be a link if it has a href', () => {
			const { getByText } = render(<Content href="/somewhere" text="text" />);
			const content = getByText('text');

			expect(content.tagName).toBe('A');
			expect(content).toHaveAttribute('href', '/somewhere');
		});

		it('should set the data-color attribute', () => {
			const { getByText } = render(<Content color="blueLight" href="/somewhere" text="text" />);
			const content = getByText('text');

			expect(content.dataset).toHaveProperty('color', 'blueLight');
		});

		it('should use the given linkComponent', () => {
			const { getByText } = render(
				<Content linkComponent={(props) => <div {...props} />} href="/somewhere" text="text" />,
			);
			const content = getByText('text');

			expect(content.tagName).toBe('DIV');
			expect(content).toHaveAttribute('href', '/somewhere');
		});

		it('should not have an underline', () => {
			const { getByText } = render(<Content href="/somewhere" text="text" />);
			const content = getByText('text');

			expect(content).toHaveStyleDeclaration('text-decoration', 'none');
		});
	});
});
