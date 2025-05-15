import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider, type MessageDescriptor } from 'react-intl-next';

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

	describe('old layout', () => {
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
					/>
				</IntlProvider>,
			);
			const viewProfileButton = screen.getByRole('button', { name: /View profile*/ });
			expect(viewProfileButton).toBeVisible();

			await userEvent.click(viewProfileButton);
			expect(window.open).toHaveBeenCalledWith(
				'https://test-prod-issue-create.atlassian.net/wiki/people/team/8ee37950-7de7-41ec-aee2-2c02c95949f4',
				'_blank',
			);
		});
	});

	describe('new layout', () => {
		const renderComponent = () =>
			render(
				<IntlProvider locale="en">
					<TeamProfileCard
						cloudId={mockCloudId}
						userId={mockUserId}
						containerId={'1234'}
						{...mockProfileData}
						teamCentralBaseUrl="https://test-prod-issue-create.atlassian.net/wiki"
						analyticsSource="test"
						isKudosEnabled
						otherActions={[
							{ id: '1', item: <button>Action 1 </button> },
							{ id: '2', item: <button>Action 2 </button> },
						]}
					/>
				</IntlProvider>,
			);

		it('should capture and report a11y violations', async () => {
			const { container } = renderComponent();
			await expect(container).toBeAccessible();
		});

		it('should render with given team data', () => {
			(useTeamContainers as jest.Mock).mockReturnValue({ teamContainers: [] });
			renderComponent();

			expect(screen.getByTestId('profile-header-image')).toHaveAttribute(
				'src',
				mockProfileData.headerImageUrl,
			);
			expect(screen.getByRole('heading', { name: mockProfileData.displayName })).toBeVisible();
			expect(screen.getByTestId('verified-team-icon')).toBeVisible();

			const memberCount = screen.getByText(
				new RegExp(`Contributing team • ${mockProfileData.memberCount}`),
			);
			expect(memberCount).toBeVisible();
			expect(screen.getByText(mockProfileData.description)).toBeVisible();
		});

		it('should render team links', () => {
			renderComponent();
			expect(
				screen.getByRole('link', { name: 'THE SUPER TEAM Team profile team-app-tile' }),
			).toBeInTheDocument();
		});

		it('should team containers if the team has containers other than the current one', () => {
			renderComponent();
			expect(screen.getByText('Mocked Team Containers')).toBeVisible();
		});

		it('should not render the team containers if the team does not have containers other than the current one', () => {
			(useTeamContainers as jest.Mock).mockReturnValue({ teamContainers: [ConfluenceSpace] });
			renderComponent();
			expect(screen.queryByText('Mocked Team Containers')).not.toBeInTheDocument();
		});

		it('should render the kudos button if the team has kudos enabled', async () => {
			renderComponent();
			const showMoreButton = screen.getByRole('button', { name: 'Show more' });
			expect(showMoreButton).toBeVisible();
			await userEvent.click(showMoreButton);

			const kudosButton = screen.getByRole('button', { name: 'Give kudos' });
			expect(kudosButton).toBeVisible();
		});

		it('should render other actions if provided', async () => {
			renderComponent();
			const showMoreButton = screen.getByRole('button', { name: 'Show more' });
			expect(showMoreButton).toBeVisible();
			await userEvent.click(showMoreButton);

			const action1 = screen.getByRole('button', { name: 'Action 1' });
			expect(action1).toBeInTheDocument();
			const action2 = screen.getByRole('button', { name: 'Action 2' });
			expect(action2).toBeInTheDocument();
		});
	});
});
