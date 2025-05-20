import { renderHook, waitFor } from '@testing-library/react';

import { teamsClient } from '@atlaskit/teams-client';

import { useTeamWebLinks, useTeamWebLinksActions } from './index';

jest.mock('@atlaskit/teams-client', () => ({
	teamsClient: {
		getTeamLinksByTeamId: jest.fn(),
		createTeamLink: jest.fn(),
		updateTeamLink: jest.fn(),
		deleteTeamLink: jest.fn(),
	},
}));

describe('useTeamWebLinks', () => {
	const mockTeamId = 'team-123';
	const mockLinks = [
		{
			contentTitle: 'Google slides',
			description: '',
			linkUri: 'https://docs.google.com/presentation/1',
			linkId: 'test-78c8f78e',
			teamId: mockTeamId,
		},
		{
			contentTitle: 'Google scholar',
			description: '',
			linkUri: 'https://scholar.google.com.au/intl/en/scholar/1',
			linkId: 'test-78c8f32f',
			teamId: mockTeamId,
		},
	];

	beforeEach(() => {
		jest.clearAllMocks();
		(teamsClient.getTeamLinksByTeamId as jest.Mock).mockResolvedValue({
			entities: mockLinks,
		});
	});

	it('should initialize with default state with empty links', () => {
		const { result } = renderHook(() => useTeamWebLinks());

		expect(result.current[0]).toEqual({
			teamId: '',
			isLoading: false,
			hasLoaded: false,
			hasError: false,
			shouldReload: false,
			errorType: null,
			links: [],
		});
	});

	it('should handle fetch error', async () => {
		const error = new Error('Failed to fetch');
		(teamsClient.getTeamLinksByTeamId as jest.Mock).mockRejectedValue(error);

		const { result } = renderHook(() => useTeamWebLinks());
		result.current[1].getTeamWebLinks(mockTeamId);
		await waitFor(() => {
			expect(result.current[0].hasError).toBe(true);
			expect(result.current[0].errorType).toBe(error);
			expect(result.current[0].links).toEqual([]);
		});
	});

	it('should create a team link', async () => {
		const newLink = {
			contentTitle: 'Bitbucket',
			description: 'Team repository',
			linkUri: 'https://atlassian.com/bitbucket',
		};

		const { result } = renderHook(() => useTeamWebLinksActions());
		result.current[1].createTeamWebLink(mockTeamId, newLink);

		expect(teamsClient.createTeamLink).toHaveBeenCalledWith(mockTeamId, newLink);
	});

	it('should update a team link', async () => {
		const linkId = 'link-1';
		const updatedLink = {
			contentTitle: 'Updated Confluence',
			description: 'Updated team space',
			linkUri: 'https://atlassian.com/confluence/updated',
		};

		const { result } = renderHook(() => useTeamWebLinksActions());
		result.current[1].updateTeamWebLink(mockTeamId, linkId, updatedLink);
		expect(teamsClient.updateTeamLink).toHaveBeenCalledWith(mockTeamId, linkId, updatedLink);
	});

	it('should remove a team link', async () => {
		const linkId = 'link-1';

		const { result } = renderHook(() => useTeamWebLinksActions());
		result.current[1].removeWebLink(mockTeamId, linkId);

		await waitFor(() => {
			expect(teamsClient.deleteTeamLink).toHaveBeenCalledWith(mockTeamId, linkId);
			expect(teamsClient.getTeamLinksByTeamId).toHaveBeenCalledWith(mockTeamId);
		});
	});
});
