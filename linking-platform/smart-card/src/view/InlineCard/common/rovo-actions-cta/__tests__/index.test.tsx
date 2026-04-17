import React from 'react';

import { IntlProvider } from 'react-intl';

import { render, screen } from '@atlassian/testing-library';

import { RovoActionsCta } from '../index';

describe('RovoActionsCta', () => {
	it('should be accessible', async () => {
		const { container } = render(
			<IntlProvider locale="en">
				<RovoActionsCta testId="rovo-actions-cta" />
			</IntlProvider>,
		);
		await expect(container).toBeAccessible();
	});

	it('renders the icon', () => {
		render(
			<IntlProvider locale="en">
				<RovoActionsCta testId="rovo-actions-cta" />
			</IntlProvider>,
		);
		expect(screen.getByTestId('rovo-actions-cta')).toBeInTheDocument();
	});
});
