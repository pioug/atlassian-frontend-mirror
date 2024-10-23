import React from 'react';

import { render, waitFor } from '@testing-library/react';

import { GiveKudosLauncherLazy } from '@atlaskit/give-kudos';

import ProfileCardResourced from '../ProfileCardResourced';

jest.mock('@atlaskit/give-kudos', () => ({
	...jest.requireActual('@atlaskit/give-kudos'),
	GiveKudosLauncherLazy: jest.fn(),
}));

const mockGiveKudosLauncherLazy = GiveKudosLauncherLazy as unknown as jest.Mock;

describe('ProfileCardResourced', () => {
	const mockCloudId = 'mock-cloud-id';
	const mockUserId = 'mock-user-id';

	const mockTeamCentralBaseUrl = 'mock-team-central-base-url';

	const mockGetProfile = jest.fn();
	const mockGetReportingLines = jest.fn();
	const mockGetTeamCentralBaseUrl = jest.fn();
	const mockShouldShowGiveKudos = jest.fn();
	const mockResourceClient = {
		getProfile: mockGetProfile,
		getReportingLines: mockGetReportingLines,
		getTeamCentralBaseUrl: mockGetTeamCentralBaseUrl,
		shouldShowGiveKudos: mockShouldShowGiveKudos,

		flushCache: jest.fn(),
		getTeamProfile: jest.fn(),
		getRovoAgentProfile: jest.fn(),
		deleteAgent: jest.fn(),
		setFavouriteAgent: jest.fn(),
	};

	beforeEach(() => {
		mockGiveKudosLauncherLazy.mockImplementation(() => <div>GiveKudosLauncherLazy</div>);

		mockGetProfile.mockResolvedValue({
			isBot: false,
			status: 'active',
		});
		mockGetReportingLines.mockResolvedValue({});
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('renders the GiveKudosLauncherLazy with the correct team central values', async () => {
		mockGetTeamCentralBaseUrl.mockResolvedValue(mockTeamCentralBaseUrl);
		mockShouldShowGiveKudos.mockResolvedValue(true);

		render(
			<ProfileCardResourced
				cloudId={mockCloudId}
				resourceClient={mockResourceClient}
				userId={mockUserId}
			/>,
		);

		await waitFor(() => {
			expect(mockGiveKudosLauncherLazy).toHaveBeenCalledTimes(1);
		});

		expect(mockGetTeamCentralBaseUrl).toHaveBeenCalledTimes(1);
		expect(mockGetTeamCentralBaseUrl).toHaveBeenCalledWith({
			withOrgContext: true,
			withSiteContext: true,
		});

		expect(mockGiveKudosLauncherLazy.mock.calls[0][0].teamCentralBaseUrl).toBe(
			mockTeamCentralBaseUrl,
		);
	});
});
