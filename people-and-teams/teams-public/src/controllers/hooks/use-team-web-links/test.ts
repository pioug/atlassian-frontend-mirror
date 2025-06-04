import { renderHook, waitFor } from '@testing-library/react';

import { teamsClient } from '@atlaskit/teams-client';

import { useTeamWebLinks } from './index';

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
			expect(result.current[0].isLoading).toBe(false);
			expect(result.current[0].hasLoaded).toBe(true);
			expect(result.current[0].hasError).toBe(true);
			expect(result.current[0].errorType).toBe(error);
			expect(result.current[0].links).toEqual([]);
		});
	});

	it('should create a team link and update store directly', async () => {
		const newLink = {
			contentTitle: 'Bitbucket',
			description: 'Team repository',
			linkUri: 'https://atlassian.com/bitbucket',
		};
		const createdLink = { linkId: 'new-link-id', teamId: mockTeamId, ...newLink };

		(teamsClient.createTeamLink as jest.Mock).mockResolvedValue(createdLink);

		const { result } = renderHook(() => useTeamWebLinks());
		await result.current[1].getTeamWebLinks(mockTeamId);

		await waitFor(() => {
			expect(result.current[0].links).toEqual(mockLinks);
		});

		const createResult = await result.current[1].createTeamWebLink(mockTeamId, newLink);

		expect(teamsClient.createTeamLink).toHaveBeenCalledWith(mockTeamId, newLink);
		expect(teamsClient.getTeamLinksByTeamId).toHaveBeenCalledTimes(1);
		expect(createResult).toEqual(createdLink);
		expect(result.current[0].links).toEqual([...mockLinks, createdLink]);
	});

	it('should update a team link and update store directly', async () => {
		const linkId = 'test-78c8f78e';
		const updatedLink = {
			contentTitle: 'Updated Google Slides',
			description: 'Updated team presentation',
			linkUri: 'https://docs.google.com/presentation/updated',
		};
		const updatedResult = { linkId, teamId: mockTeamId, ...updatedLink };

		(teamsClient.updateTeamLink as jest.Mock).mockResolvedValue(updatedResult);

		const { result } = renderHook(() => useTeamWebLinks());
		await result.current[1].getTeamWebLinks(mockTeamId);
		await waitFor(() => {
			expect(result.current[0].links).toEqual(mockLinks);
		});

		const updateResult = await result.current[1].updateTeamWebLink(mockTeamId, linkId, updatedLink);

		expect(teamsClient.updateTeamLink).toHaveBeenCalledWith(mockTeamId, linkId, updatedLink);
		expect(teamsClient.getTeamLinksByTeamId).toHaveBeenCalledTimes(1);
		expect(updateResult).toEqual(updatedResult);

		const expectedLinks = mockLinks.map((link) => (link.linkId === linkId ? updatedResult : link));
		expect(result.current[0].links).toEqual(expectedLinks);
	});

	it('should remove a team link and update store directly', async () => {
		const linkId = 'test-78c8f78e';

		const { result } = renderHook(() => useTeamWebLinks());
		await result.current[1].getTeamWebLinks(mockTeamId);

		await waitFor(() => {
			expect(result.current[0].links).toEqual(mockLinks);
		});

		await result.current[1].removeWebLink(mockTeamId, linkId);

		await waitFor(() => {
			expect(teamsClient.deleteTeamLink).toHaveBeenCalledWith(mockTeamId, linkId);
			expect(teamsClient.getTeamLinksByTeamId).toHaveBeenCalledTimes(1);
			const expectedLinks = mockLinks.filter((link) => link.linkId !== linkId);
			expect(result.current[0].links).toEqual(expectedLinks);
		});
	});
});
