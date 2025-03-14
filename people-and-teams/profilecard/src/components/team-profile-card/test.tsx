import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from 'react-intl-next';

import { TeamProfileCard } from './main';
import { mockProfileData } from './mocks';

describe('TeamProfileCard', () => {
	let originalWindowOpen: typeof window.open;

	beforeEach(() => {
		originalWindowOpen = window.open;
		window.open = jest.fn();
		jsdom.reconfigure({
			url: 'https://mock-confluence-tenant.jira-dev.com',
		});
	});

	afterEach(() => {
		window.open = originalWindowOpen;
	});

	test('should render with given team data', () => {
		render(
			<IntlProvider locale="en">
				<TeamProfileCard {...mockProfileData} />
			</IntlProvider>,
		);

		const headerImage = screen.getByTestId('profile-header-image');
		expect(headerImage).toHaveAttribute('src', mockProfileData.headerImageUrl);

		const displayName = screen.getByText(mockProfileData.displayName);
		expect(displayName).toBeInTheDocument();

		const verifiedIcon = screen.getByTestId('verified-team-icon');
		expect(verifiedIcon).toBeInTheDocument();

		const memberCount = screen.getByText(
			new RegExp(`Contributing team • ${mockProfileData.memberCount}`),
		);
		expect(memberCount).toBeInTheDocument();

		const description = screen.getByText(mockProfileData.description);
		expect(description).toBeInTheDocument();

		const viewProfileButton = screen.getByTestId('view-profile-button');
		expect(viewProfileButton).toBeInTheDocument();
	});

	test('should open the team profile in a new tab on click of View profile button', async () => {
		render(
			<IntlProvider locale="en">
				<TeamProfileCard {...mockProfileData} />
			</IntlProvider>,
		);
		const viewProfileButton = screen.getByTestId('view-profile-button');
		expect(viewProfileButton).toBeInTheDocument();

		await userEvent.click(viewProfileButton);

		expect(window.open).toHaveBeenCalledWith(
			'https://test-prod-issue-create.atlassian.net/wiki/people/team/8ee37950-7de7-41ec-aee2-2c02c95949f4',
			'_blank',
		);
	});
});
