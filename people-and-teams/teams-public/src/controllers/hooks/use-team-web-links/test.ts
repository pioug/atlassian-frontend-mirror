import { renderHook, waitFor } from '@testing-library/react';

import { teamsClient } from '@atlaskit/teams-client';

import { useTeamWebLinks } from './index';

jest.mock('@atlaskit/teams-client', () => ({
	teamsClient: {
		getTeamLinksByTeamId: jest.fn(),
		createTeamLink: jest.fn(),
		updateTeamLink: jest.fn(),
		deleteTeamLink: jest.fn(),
		getTeamLinkIcons: jest.fn(),
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

	const mockLinkIcons = [
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

	beforeEach(() => {
		jest.clearAllMocks();
		(teamsClient.getTeamLinksByTeamId as jest.Mock).mockResolvedValue({
			entities: mockLinks,
		});
		(teamsClient.getTeamLinkIcons as jest.Mock).mockResolvedValue(mockLinkIcons);
	});

	afterEach(() => {
		const { result } = renderHook(() => useTeamWebLinks());
		result.current[1].initialState({
			teamId: '',
			isLoading: false,
			hasLoaded: false,
			hasError: false,
			shouldReload: false,
			errorType: null,
			links: [],
			linkIcons: [],
			iconsLoading: false,
			iconsError: false,
			iconHasLoaded: false,
		});
		jest.clearAllMocks();
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
			linkIcons: [],
			iconsLoading: false,
			iconsError: false,
			iconHasLoaded: false,
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

	it('should fetch icon for newly created team link', async () => {
		const newLink = {
			contentTitle: 'Bitbucket',
			description: 'Team repository',
			linkUri: 'https://atlassian.com/bitbucket',
		};
		const createdLink = { linkId: 'new-link-id', teamId: mockTeamId, ...newLink };
		const newLinkIcon = {
			linkUrl: 'https://atlassian.com/bitbucket',
			iconUrl: 'https://atlassian.com/favicon.ico',
			productName: 'Bitbucket',
		};

		(teamsClient.createTeamLink as jest.Mock).mockResolvedValue(createdLink);
		(teamsClient.getTeamLinkIcons as jest.Mock)
			.mockResolvedValueOnce(mockLinkIcons)
			.mockResolvedValueOnce([newLinkIcon]);

		const { result } = renderHook(() => useTeamWebLinks());
		await result.current[1].getTeamWebLinks(mockTeamId);

		await waitFor(() => {
			expect(result.current[0].linkIcons).toEqual(mockLinkIcons);
		});

		await result.current[1].createTeamWebLink(mockTeamId, newLink);

		await waitFor(() => {
			expect(teamsClient.getTeamLinkIcons).toHaveBeenCalledWith([
				'https://atlassian.com/bitbucket',
			]);
			expect(result.current[0].linkIcons).toEqual([...mockLinkIcons, newLinkIcon]);
		});
	});

	it('should not fetch icon for newly created team link if already cached', async () => {
		const newLink = {
			contentTitle: 'Google Docs',
			description: 'Another Google doc',
			linkUri: 'https://docs.google.com/presentation/1',
		};
		const createdLink = { linkId: 'new-link-id', teamId: mockTeamId, ...newLink };

		(teamsClient.createTeamLink as jest.Mock).mockResolvedValue(createdLink);

		const { result } = renderHook(() => useTeamWebLinks());
		await result.current[1].getTeamWebLinks(mockTeamId);

		await waitFor(() => {
			expect(result.current[0].linkIcons).toEqual(mockLinkIcons);
		});

		(teamsClient.getTeamLinkIcons as jest.Mock).mockClear();

		await result.current[1].createTeamWebLink(mockTeamId, newLink);

		await waitFor(() => {
			expect(result.current[0].links).toEqual([...mockLinks, createdLink]);
		});

		expect(teamsClient.getTeamLinkIcons).not.toHaveBeenCalled();
		expect(result.current[0].linkIcons).toEqual(mockLinkIcons);
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

	it('should fetch new icon when updating team link URL', async () => {
		const linkId = 'test-78c8f78e';
		const updatedLink = {
			contentTitle: 'Updated Google Slides',
			description: 'Updated team presentation',
			linkUri: 'https://docs.google.com/presentation/updated',
		};
		const updatedResult = { linkId, teamId: mockTeamId, ...updatedLink };
		const newIcon = {
			linkUrl: 'https://docs.google.com/presentation/updated',
			iconUrl: 'https://docs.google.com/favicon-updated.ico',
			productName: 'Google Slides Updated',
		};

		(teamsClient.updateTeamLink as jest.Mock).mockResolvedValue(updatedResult);
		(teamsClient.getTeamLinkIcons as jest.Mock)
			.mockResolvedValueOnce(mockLinkIcons)
			.mockResolvedValueOnce([newIcon]);

		const { result } = renderHook(() => useTeamWebLinks());
		await result.current[1].getTeamWebLinks(mockTeamId);

		await waitFor(() => {
			expect(result.current[0].linkIcons).toEqual(mockLinkIcons);
		});

		await result.current[1].updateTeamWebLink(mockTeamId, linkId, updatedLink);

		await waitFor(() => {
			expect(teamsClient.getTeamLinkIcons).toHaveBeenCalledWith([
				'https://docs.google.com/presentation/updated',
			]);
			const expectedIcons = mockLinkIcons.filter(
				(icon) => icon.linkUrl !== 'https://docs.google.com/presentation/1',
			);
			expect(result.current[0].linkIcons).toEqual([...expectedIcons, newIcon]);
		});
	});

	it('should not fetch icon when updating team link without URL change', async () => {
		const linkId = 'test-78c8f78e';
		const updatedLink = {
			contentTitle: 'Updated Google Slides',
			description: 'Updated team presentation',
			linkUri: 'https://docs.google.com/presentation/1',
		};
		const updatedResult = { linkId, teamId: mockTeamId, ...updatedLink };

		(teamsClient.updateTeamLink as jest.Mock).mockResolvedValue(updatedResult);

		const { result } = renderHook(() => useTeamWebLinks());
		await result.current[1].getTeamWebLinks(mockTeamId);

		await waitFor(() => {
			expect(result.current[0].linkIcons).toEqual(mockLinkIcons);
		});

		(teamsClient.getTeamLinkIcons as jest.Mock).mockClear();
		(teamsClient.updateTeamLink as jest.Mock).mockResolvedValue(updatedResult);

		await result.current[1].updateTeamWebLink(mockTeamId, linkId, updatedLink);

		expect(teamsClient.getTeamLinkIcons).not.toHaveBeenCalled();
		expect(result.current[0].linkIcons).toEqual(mockLinkIcons);
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

	it('should fetch team links and their icons successfully', async () => {
		const { result } = renderHook(() => useTeamWebLinks());

		await result.current[1].getTeamWebLinks(mockTeamId);

		await waitFor(() => {
			expect(result.current[0].isLoading).toBe(false);
			expect(result.current[0].hasLoaded).toBe(true);
			expect(result.current[0].hasError).toBe(false);
			expect(result.current[0].links).toEqual(mockLinks);
		});

		await waitFor(() => {
			expect(teamsClient.getTeamLinkIcons).toHaveBeenCalledWith([
				'https://docs.google.com/presentation/1',
				'https://scholar.google.com.au/intl/en/scholar/1',
			]);
			expect(result.current[0].linkIcons).toEqual(mockLinkIcons);
			expect(result.current[0].iconsLoading).toBe(false);
			expect(result.current[0].iconsError).toBe(false);
		});
	});

	it('should not fetch icons when there are no links', async () => {
		jest.clearAllMocks();
		(teamsClient.getTeamLinksByTeamId as jest.Mock).mockResolvedValue({
			entities: [],
		});

		const { result } = renderHook(() => useTeamWebLinks());

		result.current[1].initialState({
			teamId: '',
			isLoading: false,
			hasLoaded: false,
			hasError: false,
			shouldReload: false,
			errorType: null,
			links: [],
			linkIcons: [],
			iconsLoading: false,
			iconsError: false,
			iconHasLoaded: false,
		});

		await result.current[1].getTeamWebLinks(mockTeamId);

		await waitFor(() => {
			expect(result.current[0].isLoading).toBe(false);
			expect(result.current[0].hasLoaded).toBe(true);
			expect(result.current[0].hasError).toBe(false);
			expect(result.current[0].links).toEqual([]);
		});

		expect(teamsClient.getTeamLinkIcons).not.toHaveBeenCalled();
		expect(result.current[0].linkIcons).toEqual([]);
		expect(result.current[0].iconsLoading).toBe(false);
		expect(result.current[0].iconsError).toBe(false);
	});
});
