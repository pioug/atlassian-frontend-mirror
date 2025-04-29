import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider, MessageDescriptor } from 'react-intl-next';

import { useTeamContainers } from '@atlaskit/teams-public';

import { TeamProfileCard } from './main';
import { mockProfileData } from './mocks';

jest.mock('@atlaskit/teams-public', () => ({
	...jest.requireActual('@atlaskit/teams-public'),
	useTeamContainers: jest.fn(),
	TeamContainers: () => <div data-testid="mocked-div">Mocked Team Containers</div>,
}));

jest.mock('react-intl-next', () => ({
	...jest.requireActual('react-intl-next'),
	useIntl: jest.fn().mockReturnValue({
		formatMessage: ({ defaultMessage }: MessageDescriptor) => defaultMessage,
	}),
}));

const JiraProject = {
	id: '5678',
	type: 'JiraProject',
	name: 'Jira Project Name',
	icon: 'icon',
	link: 'link',
};
const ConfluenceSpace = {
	id: '1234',
	type: 'ConfluenceSpace',
	name: 'Confluence Space Name',
	icon: 'icon',
	link: 'link',
};

const mockUserId = 'mockUser1';
const mockCloudId = 'mocktenant1';

describe('TeamProfileCard', () => {
	let originalWindowOpen: typeof window.open;

	beforeEach(() => {
		originalWindowOpen = window.open;
		window.open = jest.fn();
		jsdom.reconfigure({
			url: 'https://mock-confluence-tenant.jira-dev.com',
		});
		(useTeamContainers as jest.Mock).mockReturnValue({
			teamContainers: [JiraProject, ConfluenceSpace],
		});
	});

	afterEach(() => {
		window.open = originalWindowOpen;
	});

	test('should render with given team data', () => {
		(useTeamContainers as jest.Mock).mockReturnValue({ teamContainers: [] });
		render(
			<IntlProvider locale="en">
				<TeamProfileCard
					cloudId={mockCloudId}
					userId={mockUserId}
					containerId={'1234'}
					{...mockProfileData}
				/>
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

	test('should render the team connections if the team has containers other than the current one', () => {
		render(
			<IntlProvider locale="en">
				<TeamProfileCard
					cloudId={mockCloudId}
					userId={mockUserId}
					containerId={'1234'}
					{...mockProfileData}
				/>
			</IntlProvider>,
		);

		const teamConnectionsHeading = screen.getByText(/Where we work/);
		expect(teamConnectionsHeading).toBeInTheDocument();

		const teamContainers = screen.getByText('Mocked Team Containers');
		expect(teamContainers).toBeInTheDocument();
	});

	test('should not render the "Where we work" section if the team does not have containers other than the current one', () => {
		(useTeamContainers as jest.Mock).mockReturnValue({ teamContainers: [ConfluenceSpace] });
		render(
			<IntlProvider locale="en">
				<TeamProfileCard
					cloudId={mockCloudId}
					userId={mockUserId}
					containerId={'1234'}
					{...mockProfileData}
				/>
			</IntlProvider>,
		);

		const teamConnectionsHeading = screen.queryByText(/Where we work/);
		expect(teamConnectionsHeading).not.toBeInTheDocument();

		const teamContainers = screen.queryByText('Mocked Team Containers');
		expect(teamContainers).not.toBeInTheDocument();
	});

	test('should open the team profile in a new tab on click of View profile button', async () => {
		render(
			<IntlProvider locale="en">
				<TeamProfileCard
					cloudId={mockCloudId}
					userId={mockUserId}
					containerId={'1234'}
					{...mockProfileData}
				/>
			</IntlProvider>,
		);
		const viewProfileButton = screen.getByRole('button', { name: 'View profile' });
		expect(viewProfileButton).toBeInTheDocument();

		await userEvent.click(viewProfileButton);

		expect(window.open).toHaveBeenCalledWith(
			'https://test-prod-issue-create.atlassian.net/wiki/people/team/8ee37950-7de7-41ec-aee2-2c02c95949f4',
			'_blank',
		);
	});

	test('should show the view profile button', async () => {
		render(
			<IntlProvider locale="en">
				<TeamProfileCard
					cloudId={mockCloudId}
					userId={mockUserId}
					containerId={'1234'}
					{...mockProfileData}
					isKudosEnabled
				/>
			</IntlProvider>,
		);
		const viewProfileButton = screen.getByRole('link', { name: /View profile*/ });
		expect(viewProfileButton).toBeVisible();

		await userEvent.click(viewProfileButton);

		expect(viewProfileButton).toHaveAttribute(
			'href',
			'https://test-prod-issue-create.atlassian.net/wiki/people/team/8ee37950-7de7-41ec-aee2-2c02c95949f4',
		);
	});

	test('should render the kudos button if the team has kudos enabled', async () => {
		render(
			<IntlProvider locale="en">
				<TeamProfileCard
					cloudId={mockCloudId}
					userId={mockUserId}
					containerId={'1234'}
					{...mockProfileData}
					isKudosEnabled
				/>
			</IntlProvider>,
		);
		const showMoreButton = screen.getByRole('button', { name: 'Show more' });
		expect(showMoreButton).toBeVisible();
		await userEvent.click(showMoreButton);

		const kudosButton = screen.getByRole('button', { name: 'Give kudos' });
		expect(kudosButton).toBeVisible();
	});

	test('should render other actions if provided', async () => {
		render(
			<IntlProvider locale="en">
				<TeamProfileCard
					cloudId={mockCloudId}
					userId={mockUserId}
					containerId={'1234'}
					{...mockProfileData}
					otherActions={[
						{ id: '1', item: <button>Action 1 </button> },
						{ id: '2', item: <button>Action 2 </button> },
					]}
				/>
			</IntlProvider>,
		);
		const showMoreButton = screen.getByRole('button', { name: 'Show more' });
		expect(showMoreButton).toBeVisible();
		await userEvent.click(showMoreButton);

		const action1 = screen.getByRole('button', { name: 'Action 1' });
		expect(action1).toBeInTheDocument();
		const action2 = screen.getByRole('button', { name: 'Action 2' });
		expect(action2).toBeInTheDocument();
	});
});
