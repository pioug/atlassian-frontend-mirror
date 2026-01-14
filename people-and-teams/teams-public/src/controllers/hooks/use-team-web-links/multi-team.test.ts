import { teamsClient } from '@atlaskit/teams-client';
import { renderHook, waitFor } from '@atlassian/testing-library';

import { useTeamWebLinks } from './multi-team';

jest.mock('@atlaskit/teams-client', () => ({
	teamsClient: {
		getTeamLinksByTeamId: jest.fn(),
		createTeamLink: jest.fn(),
		updateTeamLink: jest.fn(),
		deleteTeamLink: jest.fn(),
		getTeamLinkIcons: jest.fn(),
		getWebLinkTitle: jest.fn(),
	},
}));

describe('useTeamWebLinks (multi-team)', () => {
	const mockTeamId1 = 'team-id-123';
	const mockTeamId2 = 'team-id-456';
	const mockLinks1 = [
		{
			contentTitle: 'Google slides',
			description: '',
			linkUri: 'https://docs.google.com/presentation/1',
			linkId: 'test-78c8f78e',
			teamId: mockTeamId1,
		},
		{
			contentTitle: 'Google scholar',
			description: '',
			linkUri: 'https://scholar.google.com.au/intl/en/scholar/1',
			linkId: 'test-78c8f32f',
			teamId: mockTeamId1,
		},
	];

	const mockLinks2 = [
		{
			contentTitle: 'Jira',
			description: '',
			linkUri: 'https://jira.atlassian.com',
			linkId: 'test-jira-123',
			teamId: mockTeamId2,
		},
	];

	const mockLinkIcons1 = [
		{
			linkUrl: 'https://docs.google.com/presentation/1',
			iconUrl: 'https://docs.google.com/favicon.ico',
			productName: 'Google Slides',
		},
		{
			linkUrl: 'https://scholar.google.com.au/intl/en/scholar/1',
			iconUrl: 'https://scholar.google.com/favicon.ico',
			productName: 'Google Scholar',
		},
	];

	const mockLinkIcons2 = [
		{
			linkUrl: 'https://jira.atlassian.com',
			iconUrl: 'https://jira.atlassian.com/favicon.ico',
			productName: 'Jira',
		},
	];

	beforeEach(() => {
		jest.clearAllMocks();
		(teamsClient.getTeamLinksByTeamId as jest.Mock).mockResolvedValue({
			entities: mockLinks1,
		});
		(teamsClient.getTeamLinkIcons as jest.Mock).mockResolvedValue(mockLinkIcons1);
	});

	it('should initialize with empty state for a new team', () => {
		const uniqueTeamId = 'team-id-init-1';
		const hookResult = renderHook(() => useTeamWebLinks(uniqueTeamId));

		expect(hookResult.current[0]).toEqual({
			teamId: uniqueTeamId,
			isLoading: false,
			hasLoaded: false,
			hasError: false,
			errorType: null,
			shouldReload: false,
			links: [],
			linkIcons: [],
			iconsLoading: false,
			iconsError: false,
			iconHasLoaded: false,
		});
	});

	it('should fetch and set team web links successfully', async () => {
		const uniqueTeamId = 'team-id-fetch-2';
		(teamsClient.getTeamLinksByTeamId as jest.Mock).mockReset();
		(teamsClient.getTeamLinksByTeamId as jest.Mock).mockResolvedValue({
			entities: mockLinks1,
		});
		(teamsClient.getTeamLinkIcons as jest.Mock).mockReset();
		(teamsClient.getTeamLinkIcons as jest.Mock).mockResolvedValue(mockLinkIcons1);

		const hookResult = renderHook(() => useTeamWebLinks(uniqueTeamId));

		await hookResult.current[1].getTeamWebLinks(uniqueTeamId);

		await waitFor(() => {
			expect(hookResult.current[0].isLoading).toBe(false);
		});
		expect(hookResult.current[0].hasLoaded).toBe(true);
		expect(hookResult.current[0].hasError).toBe(false);
		expect(hookResult.current[0].links).toEqual(mockLinks1);
		expect(hookResult.current[0].teamId).toBe(uniqueTeamId);
	});

	it('should handle errors during fetch', async () => {
		const uniqueTeamId = 'team-id-error-3';
		const mockError = new Error('Failed to fetch');
		(teamsClient.getTeamLinksByTeamId as jest.Mock).mockReset();
		(teamsClient.getTeamLinksByTeamId as jest.Mock).mockRejectedValue(mockError);

		const hookResult = renderHook(() => useTeamWebLinks(uniqueTeamId));

		await hookResult.current[1].getTeamWebLinks(uniqueTeamId);

		await waitFor(() => {
			expect(hookResult.current[0].isLoading).toBe(false);
		});
		expect(hookResult.current[0].hasLoaded).toBe(true);
		expect(hookResult.current[0].hasError).toBe(true);
		expect(hookResult.current[0].errorType).toEqual(mockError);
		expect(hookResult.current[0].links).toEqual([]);
	});

	it('should maintain separate state for multiple teams', async () => {
		const uniqueTeamId1 = 'team-id-multi-1-4';
		const uniqueTeamId2 = 'team-id-multi-2-5';
		(teamsClient.getTeamLinksByTeamId as jest.Mock).mockReset();
		(teamsClient.getTeamLinksByTeamId as jest.Mock)
			.mockResolvedValueOnce({ entities: mockLinks1 })
			.mockResolvedValueOnce({ entities: mockLinks2 });
		(teamsClient.getTeamLinkIcons as jest.Mock).mockReset();
		(teamsClient.getTeamLinkIcons as jest.Mock)
			.mockResolvedValueOnce(mockLinkIcons1)
			.mockResolvedValueOnce(mockLinkIcons2);

		const hookResult1 = renderHook(() => useTeamWebLinks(uniqueTeamId1));
		await hookResult1.current[1].getTeamWebLinks(uniqueTeamId1);

		await waitFor(() => {
			expect(hookResult1.current[0].links).toEqual(mockLinks1);
		});
		expect(hookResult1.current[0].teamId).toBe(uniqueTeamId1);

		const hookResult2 = renderHook(() => useTeamWebLinks(uniqueTeamId2));
		await hookResult2.current[1].getTeamWebLinks(uniqueTeamId2);

		await waitFor(() => {
			expect(hookResult2.current[0].links).toEqual(mockLinks2);
		});
		expect(hookResult2.current[0].teamId).toBe(uniqueTeamId2);

		// Verify team 1's state is still intact
		expect(hookResult1.current[0].links).toEqual(mockLinks1);
		expect(hookResult1.current[0].teamId).toBe(uniqueTeamId1);
	});

	it('should not fetch if team is currently loading', async () => {
		const uniqueTeamId = 'team-id-loading-6';
		let resolvePromise: (value: any) => void;
		const promise = new Promise((resolve) => {
			resolvePromise = resolve;
		});

		(teamsClient.getTeamLinksByTeamId as jest.Mock).mockReset();
		(teamsClient.getTeamLinksByTeamId as jest.Mock).mockReturnValueOnce(promise);

		const hookResult = renderHook(() => useTeamWebLinks(uniqueTeamId));

		hookResult.current[1].getTeamWebLinks(uniqueTeamId);

		await waitFor(() => {
			expect(hookResult.current[0].isLoading).toBe(true);
		});

		// Try to fetch again while loading
		const callCountBefore = (teamsClient.getTeamLinksByTeamId as jest.Mock).mock.calls.length;
		await hookResult.current[1].getTeamWebLinks(uniqueTeamId);

		// Should not have called the API again
		expect((teamsClient.getTeamLinksByTeamId as jest.Mock).mock.calls.length).toBe(callCountBefore);

		// Resolve the promise
		resolvePromise!({ entities: mockLinks1 });
		await waitFor(() => {
			expect(hookResult.current[0].isLoading).toBe(false);
		});
	});

	it('should create a team link and update store', async () => {
		const uniqueTeamId = 'team-id-create-7';
		const newLink = {
			contentTitle: 'Bitbucket',
			description: 'Team repository',
			linkUri: 'https://atlassian.com/bitbucket',
		};
		const createdLink = { linkId: 'new-link-id', teamId: uniqueTeamId, ...newLink };

		(teamsClient.getTeamLinksByTeamId as jest.Mock).mockReset();
		(teamsClient.getTeamLinksByTeamId as jest.Mock).mockResolvedValue({
			entities: mockLinks1,
		});
		(teamsClient.createTeamLink as jest.Mock).mockReset();
		(teamsClient.createTeamLink as jest.Mock).mockResolvedValue(createdLink);
		(teamsClient.getTeamLinkIcons as jest.Mock).mockReset();
		(teamsClient.getTeamLinkIcons as jest.Mock).mockResolvedValue(mockLinkIcons1);

		const hookResult = renderHook(() => useTeamWebLinks(uniqueTeamId));
		await hookResult.current[1].getTeamWebLinks(uniqueTeamId);

		await waitFor(() => {
			expect(hookResult.current[0].links).toEqual(mockLinks1);
		});

		const createResult = await hookResult.current[1].createTeamWebLink(uniqueTeamId, newLink);

		expect(teamsClient.createTeamLink).toHaveBeenCalledWith(uniqueTeamId, newLink);
		expect(createResult).toEqual(createdLink);
		expect(hookResult.current[0].links).toEqual([...mockLinks1, createdLink]);
	});

	it('should update a team link and update store', async () => {
		const uniqueTeamId = 'team-id-update-8';
		const linkId = 'test-78c8f78e';
		let updatedLink = {
			contentTitle: 'Updated Google Slides',
			description: 'Updated team presentation',
			linkUri: 'https://docs.google.com/presentation/updated',
		};
		let updatedResult = { linkId, teamId: uniqueTeamId, ...updatedLink };

		(teamsClient.getTeamLinksByTeamId as jest.Mock).mockReset();
		(teamsClient.getTeamLinksByTeamId as jest.Mock).mockResolvedValue({
			entities: mockLinks1,
		});
		(teamsClient.updateTeamLink as jest.Mock).mockReset();
		(teamsClient.updateTeamLink as jest.Mock).mockResolvedValue(updatedResult);
		(teamsClient.getTeamLinkIcons as jest.Mock).mockReset();
		(teamsClient.getTeamLinkIcons as jest.Mock).mockResolvedValue(mockLinkIcons1);

		let hookResult = renderHook(() => useTeamWebLinks(uniqueTeamId));
		await hookResult.current[1].getTeamWebLinks(uniqueTeamId);

		await waitFor(() => {
			expect(hookResult.current[0].links).toEqual(mockLinks1);
		});

		let updateResult = await hookResult.current[1].updateTeamWebLink(
			uniqueTeamId,
			linkId,
			updatedLink,
		);

		expect(teamsClient.updateTeamLink).toHaveBeenCalledWith(uniqueTeamId, linkId, updatedLink);
		expect(updateResult).toEqual(updatedResult);

		// Wait for the update to complete
		await waitFor(() => {
			const resultUpdatedLink = hookResult.current[0].links.find((link) => link.linkId === linkId);
			expect(resultUpdatedLink).toBeDefined();
		});
		const foundUpdatedLink = hookResult.current[0].links.find((link) => link.linkId === linkId);
		expect(foundUpdatedLink?.contentTitle).toBe('Updated Google Slides');
		expect(foundUpdatedLink?.linkUri).toBe('https://docs.google.com/presentation/updated');
	});

	it('should remove a team link and update store', async () => {
		const uniqueTeamId = 'team-id-remove-9';
		const linkId = 'test-78c8f78e';

		(teamsClient.getTeamLinksByTeamId as jest.Mock).mockReset();
		(teamsClient.getTeamLinksByTeamId as jest.Mock).mockResolvedValue({
			entities: mockLinks1,
		});
		(teamsClient.deleteTeamLink as jest.Mock).mockReset();
		(teamsClient.deleteTeamLink as jest.Mock).mockResolvedValue(undefined);
		(teamsClient.getTeamLinkIcons as jest.Mock).mockReset();
		(teamsClient.getTeamLinkIcons as jest.Mock).mockResolvedValue(mockLinkIcons1);

		const hookResult = renderHook(() => useTeamWebLinks(uniqueTeamId));
		await hookResult.current[1].getTeamWebLinks(uniqueTeamId);

		await waitFor(() => {
			expect(hookResult.current[0].links).toEqual(mockLinks1);
		});

		await hookResult.current[1].removeWebLink(uniqueTeamId, linkId);

		expect(teamsClient.deleteTeamLink).toHaveBeenCalledWith(uniqueTeamId, linkId);
		await waitFor(() => {
			const expectedLinks = mockLinks1.filter((link) => link.linkId !== linkId);
			expect(hookResult.current[0].links).toEqual(expectedLinks);
		});
	});

	it('should fetch team link icons after fetching links', async () => {
		const uniqueTeamId = 'team-id-icons-10';
		(teamsClient.getTeamLinksByTeamId as jest.Mock).mockReset();
		(teamsClient.getTeamLinksByTeamId as jest.Mock).mockResolvedValue({
			entities: mockLinks1,
		});
		(teamsClient.getTeamLinkIcons as jest.Mock).mockReset();
		(teamsClient.getTeamLinkIcons as jest.Mock).mockResolvedValue(mockLinkIcons1);

		const hookResult = renderHook(() => useTeamWebLinks(uniqueTeamId));

		await hookResult.current[1].getTeamWebLinks(uniqueTeamId);

		await waitFor(() => {
			expect(hookResult.current[0].links).toEqual(mockLinks1);
		});

		expect(teamsClient.getTeamLinkIcons).toHaveBeenCalledWith([
			'https://docs.google.com/presentation/1',
			'https://scholar.google.com.au/intl/en/scholar/1',
		]);
		await waitFor(() => {
			expect(hookResult.current[0].linkIcons).toEqual(mockLinkIcons1);
		});
		expect(hookResult.current[0].iconsLoading).toBe(false);
		expect(hookResult.current[0].iconsError).toBe(false);
		expect(hookResult.current[0].iconHasLoaded).toBe(true);
	});

	it('should not fetch icons when there are no links', async () => {
		const uniqueTeamId = 'team-id-no-icons-11';
		(teamsClient.getTeamLinksByTeamId as jest.Mock).mockReset();
		(teamsClient.getTeamLinksByTeamId as jest.Mock).mockResolvedValue({
			entities: [],
		});
		(teamsClient.getTeamLinkIcons as jest.Mock).mockReset();

		const hookResult = renderHook(() => useTeamWebLinks(uniqueTeamId));

		await hookResult.current[1].getTeamWebLinks(uniqueTeamId);

		await waitFor(() => {
			expect(hookResult.current[0].links).toEqual([]);
		});
		expect(hookResult.current[0].hasLoaded).toBe(true);

		expect(teamsClient.getTeamLinkIcons).not.toHaveBeenCalled();
		expect(hookResult.current[0].linkIcons).toEqual([]);
	});

	it('should fetch icon for newly created team link', async () => {
		const uniqueTeamId = 'team-id-create-icon-12';
		const newLink = {
			contentTitle: 'Bitbucket',
			description: 'Team repository',
			linkUri: 'https://atlassian.com/bitbucket',
		};
		const createdLink = { linkId: 'new-link-id', teamId: uniqueTeamId, ...newLink };
		const newLinkIcon = {
			linkUrl: 'https://atlassian.com/bitbucket',
			iconUrl: 'https://atlassian.com/favicon.ico',
			productName: 'Bitbucket',
		};

		(teamsClient.getTeamLinksByTeamId as jest.Mock).mockReset();
		(teamsClient.getTeamLinksByTeamId as jest.Mock).mockResolvedValue({
			entities: mockLinks1,
		});
		(teamsClient.createTeamLink as jest.Mock).mockReset();
		(teamsClient.createTeamLink as jest.Mock).mockResolvedValue(createdLink);
		(teamsClient.getTeamLinkIcons as jest.Mock).mockReset();
		(teamsClient.getTeamLinkIcons as jest.Mock)
			.mockResolvedValueOnce(mockLinkIcons1)
			.mockResolvedValueOnce([newLinkIcon]);

		const hookResult = renderHook(() => useTeamWebLinks(uniqueTeamId));
		await hookResult.current[1].getTeamWebLinks(uniqueTeamId);

		await waitFor(() => {
			expect(hookResult.current[0].linkIcons).toEqual(mockLinkIcons1);
		});

		await hookResult.current[1].createTeamWebLink(uniqueTeamId, newLink);

		expect(teamsClient.getTeamLinkIcons).toHaveBeenCalledWith(['https://atlassian.com/bitbucket']);
		await waitFor(() => {
			expect(hookResult.current[0].linkIcons).toEqual([...mockLinkIcons1, newLinkIcon]);
		});
	});

	it('should not fetch icon for newly created team link if already cached', async () => {
		const uniqueTeamId = 'team-id-cached-icon-13';
		const newLink = {
			contentTitle: 'Google Docs',
			description: 'Another Google doc',
			linkUri: 'https://docs.google.com/presentation/1',
		};
		const createdLink = { linkId: 'new-link-id', teamId: uniqueTeamId, ...newLink };

		(teamsClient.getTeamLinksByTeamId as jest.Mock).mockReset();
		(teamsClient.getTeamLinksByTeamId as jest.Mock).mockResolvedValue({
			entities: mockLinks1,
		});
		(teamsClient.createTeamLink as jest.Mock).mockReset();
		(teamsClient.createTeamLink as jest.Mock).mockResolvedValue(createdLink);
		(teamsClient.getTeamLinkIcons as jest.Mock).mockReset();
		(teamsClient.getTeamLinkIcons as jest.Mock).mockResolvedValue(mockLinkIcons1);

		const hookResult = renderHook(() => useTeamWebLinks(uniqueTeamId));
		await hookResult.current[1].getTeamWebLinks(uniqueTeamId);

		await waitFor(() => {
			expect(hookResult.current[0].linkIcons).toEqual(mockLinkIcons1);
		});

		(teamsClient.getTeamLinkIcons as jest.Mock).mockClear();

		await hookResult.current[1].createTeamWebLink(uniqueTeamId, newLink);

		await waitFor(() => {
			expect(hookResult.current[0].links).toContainEqual(createdLink);
		});

		expect(teamsClient.getTeamLinkIcons).not.toHaveBeenCalled();
		expect(hookResult.current[0].linkIcons).toEqual(mockLinkIcons1);
	});

	it('should fetch new icon when updating team link URL', async () => {
		const uniqueTeamId = 'team-id-update-icon-14';
		const linkId = 'test-78c8f78e';
		const updatedLink = {
			contentTitle: 'Updated Google Slides',
			description: 'Updated team presentation',
			linkUri: 'https://docs.google.com/presentation/updated',
		};
		const updatedResult = { linkId, teamId: uniqueTeamId, ...updatedLink };
		const newIcon = {
			linkUrl: 'https://docs.google.com/presentation/updated',
			iconUrl: 'https://docs.google.com/favicon-updated.ico',
			productName: 'Google Slides Updated',
		};

		(teamsClient.getTeamLinksByTeamId as jest.Mock).mockReset();
		(teamsClient.getTeamLinksByTeamId as jest.Mock).mockResolvedValue({
			entities: mockLinks1,
		});
		(teamsClient.updateTeamLink as jest.Mock).mockReset();
		(teamsClient.updateTeamLink as jest.Mock).mockResolvedValue(updatedResult);
		(teamsClient.getTeamLinkIcons as jest.Mock).mockReset();
		(teamsClient.getTeamLinkIcons as jest.Mock)
			.mockResolvedValueOnce(mockLinkIcons1)
			.mockResolvedValueOnce([newIcon]);

		const hookResult = renderHook(() => useTeamWebLinks(uniqueTeamId));
		await hookResult.current[1].getTeamWebLinks(uniqueTeamId);

		await waitFor(() => {
			expect(hookResult.current[0].linkIcons).toEqual(mockLinkIcons1);
		});

		await hookResult.current[1].updateTeamWebLink(uniqueTeamId, linkId, updatedLink);

		// Wait for the link to be updated first
		await waitFor(() => {
			const updatedLink = hookResult.current[0].links.find((link) => link.linkId === linkId);
			expect(updatedLink?.linkUri).toBe('https://docs.google.com/presentation/updated');
		});

		// Then wait for the icon to be fetched
		await waitFor(() => {
			expect(teamsClient.getTeamLinkIcons).toHaveBeenCalled();
		});
		// getTeamWebLinkIcons should be called with the new URL
		const calls = (teamsClient.getTeamLinkIcons as jest.Mock).mock.calls;
		const lastCall = calls[calls.length - 1];
		expect(lastCall[0]).toContain('https://docs.google.com/presentation/updated');

		await waitFor(() => {
			const expectedIcons = mockLinkIcons1.filter(
				(icon) => icon.linkUrl !== 'https://docs.google.com/presentation/1',
			);
			expect(hookResult.current[0].linkIcons).toEqual([...expectedIcons, newIcon]);
		});
	});

	it('should not fetch icon when updating team link without URL change', async () => {
		const uniqueTeamId = 'team-id-no-icon-update-15';
		const linkId = 'test-78c8f78e';
		const updatedLink = {
			contentTitle: 'Updated Google Slides',
			description: 'Updated team presentation',
			linkUri: 'https://docs.google.com/presentation/1',
		};
		const updatedResult = { linkId, teamId: uniqueTeamId, ...updatedLink };

		(teamsClient.getTeamLinksByTeamId as jest.Mock).mockReset();
		(teamsClient.getTeamLinksByTeamId as jest.Mock).mockResolvedValue({
			entities: mockLinks1,
		});
		(teamsClient.updateTeamLink as jest.Mock).mockReset();
		(teamsClient.updateTeamLink as jest.Mock).mockResolvedValue(updatedResult);
		(teamsClient.getTeamLinkIcons as jest.Mock).mockReset();
		(teamsClient.getTeamLinkIcons as jest.Mock).mockResolvedValue(mockLinkIcons1);

		const hookResult = renderHook(() => useTeamWebLinks(uniqueTeamId));
		await hookResult.current[1].getTeamWebLinks(uniqueTeamId);

		await waitFor(() => {
			expect(hookResult.current[0].linkIcons).toEqual(mockLinkIcons1);
		});

		(teamsClient.getTeamLinkIcons as jest.Mock).mockClear();

		await hookResult.current[1].updateTeamWebLink(uniqueTeamId, linkId, updatedLink);

		expect(teamsClient.getTeamLinkIcons).not.toHaveBeenCalled();
		expect(hookResult.current[0].linkIcons).toEqual(mockLinkIcons1);
	});

	it('should fetch web link title', async () => {
		const url = 'https://example.com';
		const mockTitle = 'Example Title';

		(teamsClient.getWebLinkTitle as jest.Mock).mockReset();
		(teamsClient.getWebLinkTitle as jest.Mock).mockResolvedValue(mockTitle);

		const hookResult = renderHook(() => useTeamWebLinks('team-id-title-16'));

		const title = await hookResult.current[1].fetchWebLinkTitle(url);

		expect(teamsClient.getWebLinkTitle).toHaveBeenCalledWith(url);
		expect(title).toBe(mockTitle);
	});

	it('should return undefined for empty URL when fetching web link title', async () => {
		const hookResult = renderHook(() => useTeamWebLinks('team-id-empty-17'));

		const title = await hookResult.current[1].fetchWebLinkTitle('');

		expect(teamsClient.getWebLinkTitle).not.toHaveBeenCalled();
		expect(title).toBeUndefined();
	});

	it('should handle icon fetch error', async () => {
		const uniqueTeamId = 'team-id-icon-error-18';
		(teamsClient.getTeamLinksByTeamId as jest.Mock).mockReset();
		(teamsClient.getTeamLinksByTeamId as jest.Mock).mockResolvedValue({
			entities: mockLinks1,
		});
		(teamsClient.getTeamLinkIcons as jest.Mock).mockReset();
		(teamsClient.getTeamLinkIcons as jest.Mock).mockRejectedValue(new Error('Icon fetch failed'));

		const hookResult = renderHook(() => useTeamWebLinks(uniqueTeamId));

		await hookResult.current[1].getTeamWebLinks(uniqueTeamId);

		await waitFor(() => {
			expect(hookResult.current[0].links).toEqual(mockLinks1);
		});

		await waitFor(() => {
			expect(hookResult.current[0].iconsLoading).toBe(false);
		});
		expect(hookResult.current[0].iconsError).toBe(true);
		expect(hookResult.current[0].iconHasLoaded).toBe(true);
	});

	it('should reset state when initialState is called', async () => {
		const uniqueTeamId = 'team-id-reset-100';
		(teamsClient.getTeamLinksByTeamId as jest.Mock).mockReset();
		(teamsClient.getTeamLinksByTeamId as jest.Mock).mockResolvedValue({
			entities: mockLinks1,
		});
		(teamsClient.getTeamLinkIcons as jest.Mock).mockReset();
		(teamsClient.getTeamLinkIcons as jest.Mock).mockResolvedValue(mockLinkIcons1);

		const hookResult = renderHook(() => useTeamWebLinks(uniqueTeamId));

		await hookResult.current[1].getTeamWebLinks(uniqueTeamId);

		await waitFor(() => {
			expect(hookResult.current[0].links).toEqual(mockLinks1);
		});
		expect(hookResult.current[0].hasLoaded).toBe(true);

		// Reset state
		hookResult.current[1].initialState();

		// State should be reset
		expect(hookResult.current[0].links).toEqual([]);
		expect(hookResult.current[0].hasLoaded).toBe(false);
		expect(hookResult.current[0].isLoading).toBe(false);
	});

	it('should handle removing a link that does not exist', async () => {
		const uniqueTeamId = 'team-id-remove-nonexistent-1';
		(teamsClient.getTeamLinksByTeamId as jest.Mock).mockReset();
		(teamsClient.getTeamLinksByTeamId as jest.Mock).mockResolvedValue({
			entities: mockLinks1,
		});
		(teamsClient.deleteTeamLink as jest.Mock).mockReset();
		(teamsClient.deleteTeamLink as jest.Mock).mockResolvedValue(undefined);

		const hookResult = renderHook(() => useTeamWebLinks(uniqueTeamId));
		await hookResult.current[1].getTeamWebLinks(uniqueTeamId);

		await waitFor(() => {
			expect(hookResult.current[0].links).toEqual(mockLinks1);
		});

		const initialLinksCount = hookResult.current[0].links.length;

		// Try to remove a non-existent link
		await hookResult.current[1].removeWebLink(uniqueTeamId, 'non-existent-link-id');

		expect(teamsClient.deleteTeamLink).toHaveBeenCalledWith(uniqueTeamId, 'non-existent-link-id');
		// Links should remain unchanged
		await waitFor(() => {
			expect(hookResult.current[0].links.length).toBe(initialLinksCount);
		});
	});
});
