import React from 'react';
import { render, screen } from '@testing-library/react';
import { Wrapper } from '../../styled';
import { matchers } from 'jest-emotion';

expect.extend(matchers);

describe('Wrapper', () => {
	it('should set user-select to none for firefox to fix duplicate copy / paste bug', async () => {
		// this is required till the firefox bug https://bugzilla.mozilla.org/show_bug.cgi?id=1600848 is fixed
		render(<Wrapper />);
		expect(await screen.findByTestId('frame-wrapper')).toHaveCompiledCss({
			'-moz-user-select': 'none',
		});
	});

	it('should be void of a11y violations', async () => {
		const { container } = render(<Wrapper />);
		await expect(container).toBeAccessible();
	});
});
