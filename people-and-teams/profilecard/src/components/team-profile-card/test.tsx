import React from 'react';

import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider, type MessageDescriptor } from 'react-intl-next';

import { useTeamContainers } from '@atlaskit/teams-public';
import { ffTest } from '@atlassian/feature-flags-test-utils';
import {
	mockRunItLaterSynchronously,
	renderWithAnalyticsListener as render,
} from '@atlassian/ptc-test-utils';

import { TeamProfileCard, type TeamProfileCardProps } from './main';
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

const profileLinkClickEvent = {
	action: 'clicked',
	actionSubject: 'button',
	actionSubjectId: 'viewTeamProfileButton',
	attributes: {},
};

mockRunItLaterSynchronously();

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

	const renderComponent = (props: Partial<TeamProfileCardProps> = {}) =>
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
					{...props}
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

	it('should render member count as 100+ if the member count is string', () => {
		renderComponent({ memberCount: '100+' });
		expect(screen.getByText('Contributing team • 100+ members')).toBeVisible();
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

	ffTest.off('ptc-enable-profile-card-analytics-refactor', 'legacy analytics', () => {
		it('should fire analytics on profile link item click', async () => {
			const { expectEventToBeFired } = renderComponent();

			await userEvent.click(screen.getByTestId('team-profile-card-profile-link-item'));

			expectEventToBeFired('ui', profileLinkClickEvent);
		});
	});
	ffTest.on('ptc-enable-profile-card-analytics-refactor', 'new analytics', () => {
		it('should fire analytics on profile link item click', async () => {
			const { expectEventToBeFired } = renderComponent();

			await userEvent.click(screen.getByTestId('team-profile-card-profile-link-item'));

			expectEventToBeFired('ui', profileLinkClickEvent);
		});
	});
});
