import React from 'react';

import { render, screen } from '@testing-library/react';

import Link from '../../../../index';

const testId = 'link';

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe(`Disabled:`, () => {
	// `disabled` is not a valid HTML anchor attribute
	it('does not allow `disabled` attribute to be passed', () => {
		render(
			<Link
				href="https://www.atlassian.com"
				testId={testId}
				// @ts-expect-error
				disabled
			>
				Hello world
			</Link>,
		);
		const link = screen.getByTestId(testId);

		expect(link).toBeEnabled();
	});
});
