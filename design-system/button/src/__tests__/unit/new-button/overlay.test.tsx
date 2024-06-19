import React from 'react';
/* eslint-disable @atlaskit/design-system/no-deprecated-apis */

import { render, screen } from '@testing-library/react';

import variants from '../../../utils/variants';
import testEventBlocking from '../_util/test-event-blocking';

variants.forEach(async ({ name, Component, elementType }) => {
	testEventBlocking(Component, {
		overlay: 'hello',
	});

	describe(`${name}: overlay`, () => {
		it('is not focusable', () => {
			render(
				<Component testId="button" overlay="hello">
					Hello
				</Component>,
			);
			const button = screen.getByTestId('button');

			button.focus();

			expect(button).not.toHaveFocus();
		});

		if (elementType === HTMLAnchorElement) {
			it('<a> should remove href attribute when there is an overlay', () => {
				const { rerender } = render(
					<Component testId="button" href="http://foo.com">
						Hello
					</Component>,
				);
				const button = screen.getByTestId('button');

				expect(button).toHaveAttribute('href');

				rerender(
					<Component testId="button" href="http://foo.com" overlay="hey">
						Hello
					</Component>,
				);

				expect(button).not.toHaveAttribute('href');
			});
		}
	});
});
