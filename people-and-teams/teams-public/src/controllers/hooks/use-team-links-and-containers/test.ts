import { renderHook, waitFor } from '@testing-library/react';

import { type TeamContainer, type TeamWebLink } from '../../../common/types';
import * as useTeamContainersModule from '../use-team-containers';
import * as useTeamWebLinksModule from '../use-team-web-links';

import { useTeamLinksAndContainers } from './index';

describe('useTeamLinksAndContainers', () => {
	const teamId = 'team-id-123';

	const mockTeamContainers: TeamContainer[] = [
		{
			id: 'container-1',
			type: 'ConfluenceSpace',
			name: 'Confluence Space',
			icon: null,
			link: 'https://example.com/confluence',
		},
		{
			id: 'container-2',
			type: 'JiraProject',
			name: 'Jira Project',
			icon: null,
			link: 'https://example.com/jira',
		},
	];

	const mockWebLinks: TeamWebLink[] = [
		{
			contentTitle: 'Google slides',
			description: '',
			linkUri: 'https://docs.google.com/presentation/1',
			linkId: 'test-78c8f78e',
			teamId: teamId,
		},
		{
			contentTitle: 'Google scholar',
			description: '',
			linkUri: 'https://scholar.google.com.au/intl/en/scholar/1',
			linkId: 'test-78c8f32f',
			teamId: teamId,
		},
	];

	const mockGetTeamWebLinks = jest.fn();
	const mockCreateTeamWebLink = jest.fn();
	const mockUpdateTeamWebLink = jest.fn();
	const mockRemoveWebLink = jest.fn();
	const mockAddTeamContainer = jest.fn();
	const mockUnlinkTeamContainers = jest.fn();

	beforeEach(() => {
		jest.spyOn(useTeamContainersModule, 'useTeamContainers').mockReturnValue({
			teamContainers: mockTeamContainers,
			hasLoaded: true,
			loading: false,
			error: null,
			unlinkError: null,
			teamId,
			connectedTeams: {
				containerId: undefined,
				isLoading: false,
				hasLoaded: true,
				teams: [],
				error: null,
				numberOfTeams: 0,
			},
			addTeamContainer: mockAddTeamContainer,
			unlinkTeamContainers: mockUnlinkTeamContainers,
		});

		jest.spyOn(useTeamWebLinksModule, 'useTeamWebLinks').mockReturnValue([
			{
				teamId,
				isLoading: false,
				hasLoaded: true,
				hasError: false,
				shouldReload: false,
				errorType: null,
				links: mockWebLinks,
			},
			{
				getTeamWebLinks: mockGetTeamWebLinks,
				createTeamWebLink: mockCreateTeamWebLink,
				updateTeamWebLink: mockUpdateTeamWebLink,
				removeWebLink: mockRemoveWebLink,
				initialState: jest.fn(),
			},
		]);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should fetch team web links on initialization', () => {
		renderHook(() => useTeamLinksAndContainers(teamId));
		expect(mockGetTeamWebLinks).toHaveBeenCalledWith(teamId);
	});

	it('should combine team containers and web links and set hasLoaded to true when not loading', () => {
		const { result } = renderHook(() => useTeamLinksAndContainers(teamId));

		expect(result.current.hasLoaded).toBe(true);
		expect(result.current.teamLinks).toHaveLength(4);
		expect(result.current.teamLinks).toEqual([
			...mockTeamContainers,
			{
				id: 'test-78c8f78e',
				type: 'WebLink',
				name: 'Google slides',
				icon: null,
				link: 'https://docs.google.com/presentation/1',
			},
			{
				id: 'test-78c8f32f',
				type: 'WebLink',
				name: 'Google scholar',
				icon: null,
				link: 'https://scholar.google.com.au/intl/en/scholar/1',
			},
		]);
	});

	it('should set canAddMoreLink to true when total containers is less than or equal to 10', () => {
		const { result } = renderHook(() => useTeamLinksAndContainers(teamId));
		expect(result.current.canAddMoreLink).toBe(true);
	});

	it('should set canAddMoreLink to false when total containers is more than 10', () => {
		const moreThanTenContainers = [...mockTeamContainers];
		for (let i = 3; i <= 11; i++) {
			moreThanTenContainers.push({
				id: `container-${i}`,
				type: 'ConfluenceSpace',
				name: `Container ${i}`,
				icon: null,
				link: `https://example.com/container${i}`,
			});
		}

		jest.spyOn(useTeamContainersModule, 'useTeamContainers').mockReturnValueOnce({
			teamContainers: moreThanTenContainers,
			hasLoaded: true,
			loading: false,
			error: null,
			unlinkError: null,
			teamId,
			connectedTeams: {
				containerId: undefined,
				isLoading: false,
				hasLoaded: true,
				teams: [],
				error: null,
				numberOfTeams: 0,
			},
			addTeamContainer: mockAddTeamContainer,
			unlinkTeamContainers: mockUnlinkTeamContainers,
		});

		const { result } = renderHook(() => useTeamLinksAndContainers(teamId));
		expect(result.current.canAddMoreLink).toBe(false);
	});

	it('should set isLoading to true and hasLoaded to false when containers are loading', () => {
		jest.spyOn(useTeamContainersModule, 'useTeamContainers').mockReturnValueOnce({
			teamContainers: mockTeamContainers,
			hasLoaded: false,
			loading: true,
			error: null,
			unlinkError: null,
			teamId,
			connectedTeams: {
				containerId: undefined,
				isLoading: false,
				hasLoaded: true,
				teams: [],
				error: null,
				numberOfTeams: 0,
			},
			addTeamContainer: mockAddTeamContainer,
			unlinkTeamContainers: mockUnlinkTeamContainers,
		});

		const { result } = renderHook(() => useTeamLinksAndContainers(teamId));
		expect(result.current.isLoading).toBe(true);
		expect(result.current.hasLoaded).toBe(false);
	});

	it('should set isLoading to true and hasLoaded to false when web links are loading', () => {
		jest.spyOn(useTeamWebLinksModule, 'useTeamWebLinks').mockReturnValueOnce([
			{
				teamId,
				isLoading: true,
				hasLoaded: false,
				hasError: false,
				shouldReload: false,
				errorType: null,
				links: mockWebLinks,
			},
			{
				getTeamWebLinks: mockGetTeamWebLinks,
				createTeamWebLink: mockCreateTeamWebLink,
				updateTeamWebLink: mockUpdateTeamWebLink,
				removeWebLink: mockRemoveWebLink,
				initialState: jest.fn(),
			},
		]);

		const { result } = renderHook(() => useTeamLinksAndContainers(teamId));
		expect(result.current.isLoading).toBe(true);
		expect(result.current.hasLoaded).toBe(false);
	});

	it('should set hasError and containersError to true when containers have an error', () => {
		jest.spyOn(useTeamContainersModule, 'useTeamContainers').mockReturnValueOnce({
			teamContainers: mockTeamContainers,
			hasLoaded: true,
			loading: false,
			error: new Error('Container error'),
			unlinkError: null,
			teamId,
			connectedTeams: {
				containerId: undefined,
				isLoading: false,
				hasLoaded: true,
				teams: [],
				error: null,
				numberOfTeams: 0,
			},
			addTeamContainer: mockAddTeamContainer,
			unlinkTeamContainers: mockUnlinkTeamContainers,
		});

		const { result } = renderHook(() => useTeamLinksAndContainers(teamId));
		expect(result.current.hasError).toBe(true);
		expect(result.current.containersError).toBe(true);
		expect(result.current.webLinksError).toBe(false);
	});

	it('should set hasError and webLinksError to true when web links have an error', () => {
		jest.spyOn(useTeamWebLinksModule, 'useTeamWebLinks').mockReturnValueOnce([
			{
				teamId,
				isLoading: false,
				hasLoaded: true,
				hasError: true,
				shouldReload: false,
				errorType: new Error('Link error'),
				links: mockWebLinks,
			},
			{
				getTeamWebLinks: mockGetTeamWebLinks,
				createTeamWebLink: mockCreateTeamWebLink,
				updateTeamWebLink: mockUpdateTeamWebLink,
				removeWebLink: mockRemoveWebLink,
				initialState: jest.fn(),
			},
		]);

		const { result } = renderHook(() => useTeamLinksAndContainers(teamId));
		expect(result.current.hasError).toBe(true);
		expect(result.current.webLinksError).toBe(true);
		expect(result.current.containersError).toBe(false);
	});

	it('should set hasLoaded to true when both containers and web links have finished loading', () => {
		const { result } = renderHook(() => useTeamLinksAndContainers(teamId));
		expect(result.current.isLoading).toBe(false);
		expect(result.current.hasLoaded).toBe(true);
	});

	it('should set both containersError and webLinksError when both have errors', () => {
		jest.spyOn(useTeamContainersModule, 'useTeamContainers').mockReturnValueOnce({
			teamContainers: mockTeamContainers,
			hasLoaded: true,
			loading: false,
			error: new Error('Container error'),
			unlinkError: null,
			teamId,
			connectedTeams: {
				containerId: undefined,
				isLoading: false,
				hasLoaded: true,
				teams: [],
				error: null,
				numberOfTeams: 0,
			},
			addTeamContainer: mockAddTeamContainer,
			unlinkTeamContainers: mockUnlinkTeamContainers,
		});

		jest.spyOn(useTeamWebLinksModule, 'useTeamWebLinks').mockReturnValueOnce([
			{
				teamId,
				isLoading: false,
				hasLoaded: true,
				hasError: true,
				shouldReload: false,
				errorType: new Error('Link error'),
				links: mockWebLinks,
			},
			{
				getTeamWebLinks: mockGetTeamWebLinks,
				createTeamWebLink: mockCreateTeamWebLink,
				updateTeamWebLink: mockUpdateTeamWebLink,
				removeWebLink: mockRemoveWebLink,
				initialState: jest.fn(),
			},
		]);

		const { result } = renderHook(() => useTeamLinksAndContainers(teamId));
		expect(result.current.hasError).toBe(true);
		expect(result.current.containersError).toBe(true);
		expect(result.current.webLinksError).toBe(true);
	});

	it('should add a WebLink container by converting it to a NewTeamWebLink', async () => {
		const { result } = renderHook(() => useTeamLinksAndContainers(teamId));

		const webLinkContainer: TeamContainer = {
			id: 'new-web-link',
			type: 'WebLink',
			name: 'New Web Link',
			icon: null,
			link: 'https://example.com/new-link',
		};

		mockCreateTeamWebLink.mockResolvedValueOnce({ success: true });

		result.current.addTeamLink(webLinkContainer);

		await waitFor(() => {
			expect(mockCreateTeamWebLink).toHaveBeenCalledWith(teamId, {
				contentTitle: 'New Web Link',
				description: '',
				linkUri: 'https://example.com/new-link',
			});
		});
	});

	it('should add a non-WebLink container using addTeamContainer', async () => {
		const { result } = renderHook(() => useTeamLinksAndContainers(teamId));

		const confluenceContainer: TeamContainer = {
			id: 'new-confluence',
			type: 'ConfluenceSpace',
			name: 'New Confluence Space',
			icon: null,
			link: 'https://example.com/new-confluence',
		};

		result.current.addTeamLink(confluenceContainer);

		await waitFor(() => {
			expect(mockAddTeamContainer).toHaveBeenCalledWith(confluenceContainer);
		});
	});

	it('should update a WebLink container by linkId using updateTeamLinkById', async () => {
		const { result } = renderHook(() => useTeamLinksAndContainers(teamId));

		const linkId = 'test-78c8f78e';
		const updatedFields = {
			contentTitle: 'Updated Google Slides',
			linkUri: 'https://docs.google.com/presentation/3',
		};

		mockUpdateTeamWebLink.mockResolvedValueOnce({ success: true });

		result.current.updateTeamLinkById(linkId, updatedFields);

		await waitFor(() => {
			expect(mockUpdateTeamWebLink).toHaveBeenCalledWith(teamId, 'test-78c8f78e', {
				contentTitle: 'Updated Google Slides',
				description: '',
				linkUri: 'https://docs.google.com/presentation/3',
			});
		});
	});

	it('should remove a WebLink container using removeWebLink', async () => {
		const { result } = renderHook(() => useTeamLinksAndContainers(teamId));

		const webLinkContainer: TeamContainer = {
			id: 'test-78c8f78e',
			type: 'WebLink',
			name: 'Google slides',
			icon: null,
			link: 'https://docs.google.com/presentation/1',
		};

		mockRemoveWebLink.mockResolvedValueOnce({ success: true });

		result.current.removeTeamLink(webLinkContainer);

		await waitFor(() => {
			expect(mockRemoveWebLink).toHaveBeenCalledWith(teamId, 'test-78c8f78e');
		});
	});

	it('should remove a non-WebLink container using unlinkTeamContainers', async () => {
		const { result } = renderHook(() => useTeamLinksAndContainers(teamId));

		const confluenceContainer: TeamContainer = {
			id: 'container-1',
			type: 'ConfluenceSpace',
			name: 'Confluence Space',
			icon: null,
			link: 'https://example.com/confluence',
		};

		mockUnlinkTeamContainers.mockResolvedValueOnce({ success: true });

		result.current.removeTeamLink(confluenceContainer);

		await waitFor(() => {
			expect(mockUnlinkTeamContainers).toHaveBeenCalledWith('container-1');
		});
	});
});
