import React from 'react';

import { IntlProvider } from 'react-intl';

import { mockExpEnabled } from '@atlassian/experiment-test-utils/mock-exp-enabled';
import { screen } from '@atlassian/testing-library/screen';
import { render } from '@atlassian/testing-library/testing-library/react';

import MentionDescriptionByline from '../../../../components/MentionDescriptionByline';
import { type MentionDescription } from '../../../../types';
import { teamMention, userMention } from './_commonData';

const renderByline = (mention: MentionDescription) =>
	render(
		<IntlProvider locale="en">
			<MentionDescriptionByline mention={mention} />
		</IntlProvider>,
	);

describe('Mention Description Byline', () => {
	it('preserves the cross-product byline when email is available', async () => {
		mockExpEnabled('platform_editor_mentions_email_search');
		renderByline({
			...userMention,
			name: 'Test User',
			isXProductUser: true,
			email: 'test@example.com',
		});

		expect(screen.queryByText('test@example.com')).not.toBeInTheDocument();
		expect(screen.getByText('Needs access to Confluence')).toBeInTheDocument();
		await expect(document.body).toBeAccessible();
	});

	it('preserves the team byline when email is available', async () => {
		mockExpEnabled('platform_editor_mentions_email_search');
		renderByline({ ...teamMention, email: 'test@example.com' });

		expect(screen.queryByText('test@example.com')).not.toBeInTheDocument();
		expect(screen.getByText('Team • 5 members, including you')).toBeInTheDocument();
		await expect(document.body).toBeAccessible();
	});

	it('should render the user mention description when a user is provided', async () => {
		renderByline(userMention);

		expect(screen.getByText('@Test User')).toBeInTheDocument();
		await expect(document.body).toBeAccessible();
	});

	it('should render the team mention description when a team is provided', async () => {
		renderByline(teamMention);

		expect(screen.getByText('Team • 5 members, including you')).toBeInTheDocument();
		await expect(document.body).toBeAccessible();
	});
});
