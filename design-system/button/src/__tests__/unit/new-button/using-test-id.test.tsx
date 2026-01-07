import React from 'react';

import { render, screen } from '@testing-library/react';

import variants from '../../../utils/variants';

variants.forEach(({ name, Component, elementType }) => {
	// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
	describe(`${name} should render test ID`, () => {
		it('on button', async () => {
			render(<Component testId={name}>Button</Component>);

			expect(screen.getByTestId(name)).toBeInTheDocument();
		});

		if (elementType === HTMLButtonElement) {
			it('on loading spinner', async () => {
				render(
					<Component testId={name} isLoading>
						Button
					</Component>,
				);

				expect(screen.getByTestId(`${name}--loading-spinner-wrapper`)).toBeInTheDocument();
			});
		}
	});
});
