import React from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from 'react-intl-next';

import { GiveKudosLauncherLazy } from '@atlaskit/give-kudos';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import ProfileClient from '../../../client/ProfileCardClient';
import { getMockProfileClient } from '../../../mocks';
import { type TeamProfileCardTriggerProps } from '../../../types';
import { TeamProfileCardLazy } from '../lazyTeamProfileCard';
import TeamProfilecardTrigger from '../TeamProfileCardTrigger';

const mockClient = getMockProfileClient(ProfileClient, 0);

jest.mock('@atlaskit/analytics-next', () => ({
	...jest.requireActual<any>('@atlaskit/analytics-next'),
	useAnalyticsEvents: jest.fn(() => ({
		createAnalyticsEvent: jest.fn(() => ({ fire: jest.fn() })),
	})),
}));

jest.mock('@atlaskit/give-kudos', () => ({
	...jest.requireActual('@atlaskit/give-kudos'),
	GiveKudosLauncherLazy: jest.fn(),
}));

jest.mock('../../../util/analytics');

jest.mock('../lazyTeamProfileCard', () => ({
	TeamProfileCardLazy: jest.fn(),
}));

const mockGiveKudosLauncherLazy = GiveKudosLauncherLazy as unknown as jest.Mock;
const mockTeamProfileCardLazy = TeamProfileCardLazy as unknown as jest.Mock;

describe('Profile card trigger', () => {
	const mockTeamCentralBaseUrl = 'mock-team-central-base-url';

	const mockGiveKudosLauncherLazyText = 'MockGiveKudosLauncherLazy';
	const mockProfileCardLazyText = 'MockTeamProfileCardLazy';
	const mockTriggerText = 'Trigger';

	const mockGetTeamCentralBaseUrl = jest.fn();
	const mockShouldShowGiveKudos = jest.fn();
	const mockResourceClient = {
		...mockClient,
		getTeamCentralBaseUrl: mockGetTeamCentralBaseUrl,
		shouldShowGiveKudos: mockShouldShowGiveKudos,
	};
	const mockDefaultProps = {
		cloudId: 'cloud-id',
		userId: 'user-id',
		resourceClient: mockResourceClient,
		viewProfileLink: '/',
		teamId: 'team-id',
		orgId: 'org-id',
	};

	beforeEach(() => {
		jest.clearAllMocks();

		mockGiveKudosLauncherLazy.mockImplementation(() => <div>{mockGiveKudosLauncherLazyText}</div>);
		mockTeamProfileCardLazy.mockImplementation(() => <div>{mockProfileCardLazyText}</div>);

		mockGetTeamCentralBaseUrl.mockResolvedValue(mockTeamCentralBaseUrl);
		mockShouldShowGiveKudos.mockResolvedValue(true);
	});

	const renderTeamProfileCardTrigger = (props: Partial<TeamProfileCardTriggerProps>) => {
		return render(
			<IntlProvider locale="en">
				<TeamProfilecardTrigger {...mockDefaultProps} {...props}>
					<div>{mockTriggerText}</div>
				</TeamProfilecardTrigger>
			</IntlProvider>,
		);
	};

	it('renders the trigger', () => {
		renderTeamProfileCardTrigger({});

		expect(screen.getByText(mockTriggerText)).toBeVisible();
	});

	it('renders with valid team central values', async () => {
		const mockGetTeamProfile = jest.fn();
		const mockGetReportingLines = jest.fn();

		renderTeamProfileCardTrigger({
			resourceClient: {
				...mockResourceClient,
				getTeamProfile: mockGetTeamProfile,
				getReportingLines: mockGetReportingLines,
			},
			trigger: 'click',
		});

		// click the trigger
		await userEvent.click(screen.getByText(mockTriggerText));

		await waitFor(() => {
			expect(screen.queryByText(mockGiveKudosLauncherLazyText)).toBeInTheDocument();
		});

		expect(mockGetTeamCentralBaseUrl).toHaveBeenCalledTimes(1);
		expect(mockGetTeamCentralBaseUrl).toHaveBeenCalledWith({
			withOrgContext: true,
			withSiteContext: true,
		});

		expect(mockGiveKudosLauncherLazy).toHaveBeenCalledTimes(1);
		expect(mockGiveKudosLauncherLazy.mock.calls[0][0].teamCentralBaseUrl).toBe(
			mockTeamCentralBaseUrl,
		);
		expect(mockTeamProfileCardLazy).toHaveBeenCalled();

		mockTeamProfileCardLazy.mock.calls.forEach((call) => {
			const relevantCallArgs = call[0];
			expect(
				relevantCallArgs.isLoading || call[0].actions[0].link.startsWith(mockTeamCentralBaseUrl),
			);
		});
	});

	ffTest.on(
		'enable_team_profilecard_toggletip_a11y_fix',
		'When enable_team_profilecard_toggletip_a11y_fix is on',
		() => {
			it('renders the accessible button trigger', () => {
				renderTeamProfileCardTrigger({
					triggerLinkType: 'none',
				});

				expect(screen.getByRole('button')).toBeVisible();
				expect(screen.getByRole('button')).toHaveAttribute(
					'aria-label',
					'More information about this team',
				);
			});
		},
	);

	ffTest.off(
		'enable_team_profilecard_toggletip_a11y_fix',
		'When enable_team_profilecard_toggletip_a11y_fix is off',
		() => {
			it('should not render the accessible button trigger', () => {
				renderTeamProfileCardTrigger({
					triggerLinkType: 'none',
				});

				expect(screen.queryByRole('button')).not.toBeInTheDocument();
			});
		},
	);
	it('should capture and report a11y violations', async () => {
		const { container } = render(
			<IntlProvider locale="en">
				<TeamProfilecardTrigger {...mockDefaultProps}>
					<div>{mockTriggerText}</div>
				</TeamProfilecardTrigger>
			</IntlProvider>,
		);
		await expect(container).toBeAccessible();
	});
});
