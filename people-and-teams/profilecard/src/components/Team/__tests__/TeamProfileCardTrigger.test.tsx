import React from 'react';

import { IntlProvider } from 'react-intl';

import { screen } from '@atlassian/testing-library/screen';
import { render } from '@atlassian/testing-library/testing-library/react';

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
