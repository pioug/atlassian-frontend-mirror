import React from 'react';

import { IntlProvider } from 'react-intl';

import { render, screen } from '@atlassian/testing-library';

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
