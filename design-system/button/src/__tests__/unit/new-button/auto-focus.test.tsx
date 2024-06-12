import React from 'react';

import { render, screen } from '@testing-library/react';

import variants from '../../../utils/variants';

variants.forEach(({ name, Component }) => {
	describe(name, () => {
		it('should not focus on the element if autoFocus is not set', () => {
			render(<Component testId="button">Hello</Component>);
			const button = screen.getByTestId('button');
			expect(button).not.toHaveFocus();
		});

		it('should focus on the element if autoFocus is set', () => {
			render(
				<Component testId="button" autoFocus>
					Hello
				</Component>,
			);
			const button = screen.getByTestId('button');
			expect(button).toHaveFocus();
		});

		it('should only set auto focus based on initial render', () => {
			const { rerender } = render(<Component testId="button">Hello</Component>);
			const button = screen.getByTestId('button');
			expect(button).not.toHaveFocus();

			// setting autoFocus to true after an initial render
			rerender(
				<Component testId="button" autoFocus>
					Hello
				</Component>,
			);
			expect(button).not.toHaveFocus();
		});
	});
});
