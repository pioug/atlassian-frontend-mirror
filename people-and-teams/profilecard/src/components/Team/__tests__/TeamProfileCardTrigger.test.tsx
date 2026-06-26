import React from 'react';

import { IntlProvider } from 'react-intl';

import { render, screen } from '@atlassian/testing-library';

import TeamProfilecardTrigger from '../TeamProfileCardTrigger';

describe('TeamProfileCardTrigger', () => {
	it('renders children', async () => {
		const { container } = render(
			<IntlProvider locale="en">
				<TeamProfilecardTrigger>
					<div>trigger content</div>
				</TeamProfilecardTrigger>
			</IntlProvider>,
		);

		expect(screen.getByText('trigger content')).toBeVisible();
		await expect(container).toBeAccessible();
	});
});
