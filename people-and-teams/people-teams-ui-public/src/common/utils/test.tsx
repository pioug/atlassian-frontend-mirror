/**
 *  This file isn't actually tests, it's some helper fn's
 * but we name it test so that testing-library isn't picked up as a missing dep
 *  */
import React from 'react';

import { render, type RenderResult } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

export const renderWithIntl = (component: React.ReactNode): RenderResult => {
	return render(<IntlProvider locale="en">{component}</IntlProvider>);
};

describe('utils', () => {
	// need >=1 test in each test file :eye-roll:
	it('is a fake test', async () => {
		expect(1).not.toEqual(2);

		await expect(document.body).toBeAccessible();
	});
});
