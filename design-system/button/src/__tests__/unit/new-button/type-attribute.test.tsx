import React from 'react';

import { render, screen } from '@testing-library/react';

import variants from '../../../utils/variants';

variants.forEach(({ name, Component, elementType }) => {
	describe(name, () => {
		it('should apply a provided `type` prop', () => {
			render(
				<Component testId="button" type="submit">
					Hello
				</Component>,
			);
			const button = screen.getByTestId('button');

			expect(button).toHaveAttribute('type', 'submit');
		});

		if (elementType === HTMLButtonElement) {
			it('should add a default `type="button"`', () => {
				render(<Component testId="button">Hello</Component>);
				const button = screen.getByTestId('button');

				expect(button).toHaveAttribute('type', 'button');
			});
		} else if (elementType === HTMLAnchorElement) {
			it('should not apply a default `type` to link buttons', () => {
				render(
					<Component testId="button" href="http://google.com">
						Hello
					</Component>,
				);
				const button = screen.getByTestId('button');

				expect(button).not.toHaveAttribute('type');
			});
		}
	});
});
