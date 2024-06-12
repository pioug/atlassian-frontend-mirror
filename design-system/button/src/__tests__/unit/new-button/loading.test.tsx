import React from 'react';

import { render, screen } from '@testing-library/react';

import variants from '../../../utils/variants';
import testEventBlocking from '../_util/test-event-blocking';

variants.forEach(({ name, Component, elementType }) => {
	describe(`Loading ${name}`, () => {
		testEventBlocking(Component, { isDisabled: true });

		if (elementType === HTMLButtonElement) {
			it('renders a loading spinner when isLoading prop is true', async () => {
				const { rerender } = render(<Component testId="button">Hello</Component>);

				{
					const spinner = screen.queryByLabelText(', Loading');
					expect(spinner).not.toBeInTheDocument();
				}

				rerender(
					<Component testId="button" isLoading>
						Hello
					</Component>,
				);

				{
					const spinner = screen.queryByLabelText(', Loading');
					expect(spinner).toBeInTheDocument();
				}
			});
		} else if (elementType === HTMLAnchorElement) {
			it('should never render a loading spinner for anchor elements', async () => {
				const { rerender } = render(<Component testId="button">Hello</Component>);

				{
					const spinner = screen.queryByLabelText(', Loading');
					expect(spinner).not.toBeInTheDocument();
				}

				rerender(
					<Component testId="button" isLoading>
						Hello
					</Component>,
				);

				{
					const spinner = screen.queryByLabelText(', Loading');
					expect(spinner).not.toBeInTheDocument();
				}
			});
		}
	});
});
