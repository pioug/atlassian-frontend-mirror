import React from 'react';

import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from 'react-intl-next';

import { fg } from '@atlaskit/platform-feature-flags';
import {
	mockRunItLaterSynchronously,
	renderWithAnalyticsListener as render,
} from '@atlassian/ptc-test-utils';

import { messages } from '../../common/utils/get-container-properties';
import { useProductPermissions } from '../../controllers/hooks/use-product-permission';
import { useTeamContainers } from '../../controllers/hooks/use-team-containers';
import { useTeamLinksAndContainers } from '../../controllers/hooks/use-team-links-and-containers';

import { TeamContainers } from './main';
import type { TeamContainersComponent } from './types';

jest.mock('@atlaskit/platform-feature-flags');

jest.mock('../../controllers/hooks/use-team-containers', () => ({
	...jest.requireActual('../../controllers/hooks/use-team-containers'),
	initializeCalled: jest.fn().mockReturnValue(true),
	useTeamContainers: jest.fn(),
	useTeamContainersHook: jest.fn().mockReturnValue([]),
}));

jest.mock('../../controllers/hooks/use-product-permission', () => ({
	useProductPermissions: jest.fn(),
}));

jest.mock('../../controllers/hooks/use-team-links-and-containers', () => ({
	useTeamLinksAndContainers: jest.fn(),
}));

const mockFg = fg as jest.Mock;

const renderWithIntl = (node: React.ReactNode) => {
	return render(<IntlProvider locale="en">{node}</IntlProvider>);
};

const mockOnAddAContainerClick = jest.fn();

mockRunItLaterSynchronously();

describe('TeamContainers', () => {
	const teamId = 'teamId';
	const JiraProject = {
		id: 'id-1',
		type: 'JiraProject',
		name: 'Jira Project Name',
		icon: 'icon',
		link: 'link',
	};
	const ConfluenceSpace = {
		id: 'id-2',
		type: 'ConfluenceSpace',
		name: 'Confluence Space Name',
		icon: 'icon',
		link: 'link',
	};
	const openUnlinkContainerDialogEvent = {
		action: 'opened',
		actionSubject: 'unlinkContainerDialog',
		attributes: {
			teamId: 'teamId',
		},
	};
	const teamContainerUnlinkedSucceededEvent = {
		action: 'succeeded',
		actionSubject: 'teamContainerUnlinked',
		attributes: {
			containerRemoved: {
				container: 'JiraProject',
				containerId: 'id-1',
			},
			teamId: 'teamId',
		},
	};

	const teamContainerUnlinkedFailedEvent = {
		action: 'failed',
		actionSubject: 'teamContainerUnlinked',
	};

	const renderTeamContainers = (
		teamId: string,
		filterContainerId?: string,
		isDisplayedOnProfileCard?: boolean,
		components?: TeamContainersComponent,
		maxNumberOfContainersToShow?: number,
	) => {
		return renderWithIntl(
			<TeamContainers
				teamId={teamId}
				onAddAContainerClick={mockOnAddAContainerClick}
				userId={'test-user-id'}
				cloudId={'test-cloud-id'}
				filterContainerId={filterContainerId}
				isDisplayedOnProfileCard={isDisplayedOnProfileCard}
				components={components}
				maxNumberOfContainersToShow={maxNumberOfContainersToShow}
			/>,
		);
	};

	beforeEach(() => {
		mockFg.mockImplementation(() => {
			return false;
		});
		(useTeamContainers as jest.Mock).mockReturnValue({});

		(useProductPermissions as jest.Mock).mockReturnValue({
			loading: false,
			data: {
				jira: { manage: true },
				confluence: { manage: true },
			},
			error: null,
		});
		jest.clearAllMocks();
	});

	it('should render add Jira and Confluence container card when the team has no Jira project and Confluence space linked and has product access', () => {
		(useTeamLinksAndContainers as jest.Mock).mockReturnValue({
			teamLinks: [],
		});

		renderTeamContainers(teamId);

		expect(screen.getByText(messages.addJiraProjectTitle.defaultMessage)).toBeInTheDocument();
		expect(
			screen.getByText(messages.addConfluenceContainerTitle.defaultMessage),
		).toBeInTheDocument();
	});

	it('should render add Jira and Confluence container card when the team has no Jira project and Confluence space linked and has no product access', async () => {
		(useTeamLinksAndContainers as jest.Mock).mockReturnValue({
			teamLinks: [],
		});

		(useProductPermissions as jest.Mock).mockReturnValue({
			loading: false,
			data: {
				jira: {},
				confluence: {},
			},
			error: null,
		});

		renderTeamContainers(teamId);
		expect(
			await screen.findByTestId('team-containers-no-product-access-state'),
		).toBeInTheDocument();
	});

	it('should not render the no product access state when displayed from profile card', async () => {
		(useTeamLinksAndContainers as jest.Mock).mockReturnValue({
			teamLinks: [],
		});

		(useProductPermissions as jest.Mock).mockReturnValue({
			loading: false,
			data: {
				jira: {},
				confluence: {},
			},
			error: null,
		});

		renderTeamContainers(teamId, '', true);
		expect(screen.queryByTestId('team-containers-no-product-access-state')).not.toBeInTheDocument();
	});

	it('should NOT render add Jira and Confluence container card when the team has Jira project and Confluence space linked, and should render linked containers', () => {
		(useTeamLinksAndContainers as jest.Mock).mockReturnValue({
			teamLinks: [JiraProject, ConfluenceSpace],
		});
		renderTeamContainers(teamId);

		expect(screen.queryByText(messages.addJiraProjectTitle.defaultMessage)).toBeNull();
		expect(screen.queryByText(messages.addConfluenceContainerTitle.defaultMessage)).toBeNull();
		expect(screen.getByText(JiraProject.name)).toBeInTheDocument();
		expect(screen.getByText(ConfluenceSpace.name)).toBeInTheDocument();
	});

	it('should NOT render add Jira and Confluence container card when displayed from a profile card', () => {
		(useTeamLinksAndContainers as jest.Mock).mockReturnValue({
			teamLinks: [JiraProject, ConfluenceSpace],
		});
		const mockFilterContainerId = '3';
		const isDisplayedOnProfileCard = true;
		renderTeamContainers(teamId, mockFilterContainerId, isDisplayedOnProfileCard);

		expect(screen.queryByText(messages.addJiraProjectTitle.defaultMessage)).toBeNull();
		expect(screen.queryByText(messages.addConfluenceContainerTitle.defaultMessage)).toBeNull();
		expect(screen.getByText(JiraProject.name)).toBeInTheDocument();
		expect(screen.getByText(ConfluenceSpace.name)).toBeInTheDocument();
	});

	it('should render add Jira container card when the team has no Jira project linked, and render linked Confluence space', () => {
		(useTeamLinksAndContainers as jest.Mock).mockReturnValue({
			teamLinks: [ConfluenceSpace],
		});
		renderTeamContainers(teamId);

		expect(screen.getByText(messages.addJiraProjectTitle.defaultMessage)).toBeInTheDocument();
		expect(screen.queryByText(messages.addConfluenceContainerTitle.defaultMessage)).toBeNull();
		expect(screen.getByText(ConfluenceSpace.name)).toBeInTheDocument();
	});

	it('should render add Confluence container card when the team has no Confluence space linked, and render linked Jira project', () => {
		(useTeamLinksAndContainers as jest.Mock).mockReturnValue({
			teamLinks: [JiraProject],
		});
		renderTeamContainers(teamId);

		expect(
			screen.getByText(messages.addConfluenceContainerTitle.defaultMessage),
		).toBeInTheDocument();
		expect(screen.queryByText(messages.addJiraProjectTitle.defaultMessage)).toBeNull();
		expect(screen.getByText(JiraProject.name)).toBeInTheDocument();
	});

	it('should render show more button when the team has more than 4 containers linked', async () => {
		const teamContainers = Array.from({ length: 5 }, (_, index) => ({
			id: index.toString(),
			type: 'ConfluenceSpace',
			name: `Confluence Space Name ${index}`,
			icon: 'icon',
			link: 'link',
		}));
		(useTeamLinksAndContainers as jest.Mock).mockReturnValue({
			teamLinks: teamContainers,
		});
		renderTeamContainers(teamId);

		expect(screen.getByText('Show more')).toBeInTheDocument();
		expect(await screen.findByText('Confluence Space Name 0')).toBeInTheDocument();
		expect(await screen.findByText('Confluence Space Name 1')).toBeInTheDocument();
		expect(await screen.findByText('Confluence Space Name 2')).toBeInTheDocument();
		expect(await screen.findByText('Confluence Space Name 3')).toBeInTheDocument();
		expect(screen.queryByText('Confluence Space Name 4')).toBeNull();

		screen.getByText('Show more').click();
		const showLessButton = await screen.findByText('Show less');
		const theFifthContainer = await screen.findByText('Confluence Space Name 4');
		expect(showLessButton).toBeInTheDocument();
		expect(theFifthContainer).toBeInTheDocument();
	});

	it('should only render three containers if maxNumberOfContainersToShow is 3', () => {
		const teamContainers = Array.from({ length: 5 }, (_, index) => ({
			id: index.toString(),
			type: 'ConfluenceSpace',
			name: `Confluence Space Name ${index}`,
			icon: 'icon',
			link: 'link',
		}));
		(useTeamLinksAndContainers as jest.Mock).mockReturnValue({
			teamLinks: teamContainers,
		});
		renderTeamContainers(teamId, '', true, undefined, 3);

		expect(screen.getAllByRole('link')).toHaveLength(3);
		expect(screen.getByText('Show more')).toBeInTheDocument();
	});

	it('should filter the team container if filterContainerId and isDisplayedOnProfileCard props is provided', async () => {
		const teamContainers = Array.from({ length: 5 }, (_, index) => ({
			id: index.toString(),
			type: 'ConfluenceSpace',
			name: `Confluence Space Name ${index}`,
			icon: 'icon',
			link: 'link',
		}));
		const mockFilterContainerId = '3';

		(useTeamLinksAndContainers as jest.Mock).mockReturnValue({
			teamLinks: teamContainers.filter((container) => container.id !== mockFilterContainerId),
		});

		renderTeamContainers(teamId, mockFilterContainerId, true);

		expect(await screen.findByText('Confluence Space Name 0')).toBeInTheDocument();
		expect(await screen.findByText('Confluence Space Name 1')).toBeInTheDocument();
		expect(await screen.findByText('Confluence Space Name 2')).toBeInTheDocument();
		expect(screen.queryByText('Confluence Space Name 3')).toBeNull();
		expect(await screen.findByText('Confluence Space Name 4')).toBeInTheDocument();

		expect(screen.queryByText('Show more')).not.toBeInTheDocument();
	});

	it('should call onAddAContainerClick when add container card is clicked', () => {
		(useTeamLinksAndContainers as jest.Mock).mockReturnValue({
			teamLinks: [
				{
					id: 'id',
					type: 'ConfluenceSpace',
					name: `Confluence Space Name`,
					icon: 'icon',
					link: 'link',
				},
			],
		});
		renderTeamContainers(teamId);

		screen.getAllByTestId('add-icon')[0].click();
		expect(mockOnAddAContainerClick).toHaveBeenCalledTimes(1);
	});

	it('should show skeleton when loading', () => {
		(useTeamLinksAndContainers as jest.Mock).mockReturnValue({
			isLoading: true,
			teamLinks: [],
		});
		renderTeamContainers(teamId);

		expect(screen.getByTestId('team-containers-skeleton')).toBeInTheDocument();
	});

	it('should show a custom skeleton component if passed in', () => {
		(useTeamLinksAndContainers as jest.Mock).mockReturnValue({
			isLoading: true,
			teamLinks: [],
		});

		const customContainer = () => <></>;
		const customSkeletonComponent = () => (
			<div data-testid="mocked-skeleton">Mocked Team Containers Skeleton</div>
		);
		renderTeamContainers(teamId, '', true, {
			ContainerCard: customContainer,
			TeamContainersSkeleton: customSkeletonComponent,
		});

		expect(screen.getByTestId('mocked-skeleton')).toBeInTheDocument();
	});

	it('should not render disconnect dialog initially', () => {
		(useTeamLinksAndContainers as jest.Mock).mockReturnValue({
			teamLinks: [JiraProject],
		});
		renderTeamContainers(teamId);

		expect(screen.queryByTestId('team-containers-disconnect-dialog')).toBeNull();
	});

	it('should render disconnect dialog when disconnect button is clicked', async () => {
		(useTeamLinksAndContainers as jest.Mock).mockReturnValue({
			teamLinks: [JiraProject],
		});
		renderTeamContainers(teamId);

		await userEvent.hover(screen.getByText(JiraProject.name));
		const crossIconButton = screen.getByRole('button', {
			name: `disconnect the container ${JiraProject.name}`,
		});
		await userEvent.click(crossIconButton);
		expect(await screen.findByTestId('team-containers-disconnect-dialog')).toBeInTheDocument();
	});

	// ffTest is not working in this test file due to the mocking of fg().
	describe('analytics refactor off', () => {
		beforeEach(() => {
			mockFg.mockImplementation(() => {
				return false;
			});
		});
		it('should open disconnect dialog when disconnect button is clicked', async () => {
			(useTeamLinksAndContainers as jest.Mock).mockReturnValue({
				teamLinks: [JiraProject],
			});
			const { expectEventToBeFired } = renderTeamContainers(teamId);

			await userEvent.hover(screen.getByText(JiraProject.name));
			const crossIconButton = screen.getByRole('button', {
				name: `disconnect the container ${JiraProject.name}`,
			});
			await userEvent.click(crossIconButton);
			expect(await screen.findByTestId('team-containers-disconnect-dialog')).toBeInTheDocument();
			expectEventToBeFired('track', openUnlinkContainerDialogEvent);
		});

		it('should close disconnect dialog and fire analytics event when confirmation dialog proceed', async () => {
			(useTeamLinksAndContainers as jest.Mock).mockReturnValue({
				teamLinks: [JiraProject],
				removeTeamLink: jest.fn(),
			});
			(useTeamContainers as jest.Mock).mockReturnValue({
				unlinkError: null,
			});

			const { expectEventToBeFired } = renderTeamContainers(teamId);

			await userEvent.hover(screen.getByText(JiraProject.name));
			const crossIconButton = screen.getByRole('button', {
				name: 'disconnect the container Jira Project Name',
			});
			await userEvent.click(crossIconButton);

			const disconnectButton = screen.getByRole('button', { name: 'Remove' });
			await userEvent.click(disconnectButton);

			expectEventToBeFired('track', teamContainerUnlinkedSucceededEvent);
		});

		it('should fire failed analytics event when unlink fails', async () => {
			(useTeamLinksAndContainers as jest.Mock).mockReturnValue({
				teamLinks: [JiraProject],
				removeTeamLink: jest.fn(),
			});
			(useTeamContainers as jest.Mock).mockReturnValue({
				unlinkError: 'error',
			});

			const { expectEventToBeFired } = renderTeamContainers(teamId);

			await userEvent.hover(screen.getByText(JiraProject.name));
			const crossIconButton = screen.getByRole('button', {
				name: 'disconnect the container Jira Project Name',
			});
			await userEvent.click(crossIconButton);

			const disconnectButton = screen.getByRole('button', { name: 'Remove' });
			await userEvent.click(disconnectButton);

			expectEventToBeFired('track', teamContainerUnlinkedFailedEvent);
		});
	});

	describe('analytics refactor on', () => {
		beforeEach(() => {
			mockFg.mockImplementation((flag) => {
				if (flag === 'ptc-enable-teams-public-analytics-refactor') {
					return true;
				}
				return false;
			});
		});
		it('should open disconnect dialog when disconnect button is clicked', async () => {
			(useTeamLinksAndContainers as jest.Mock).mockReturnValue({
				teamLinks: [JiraProject],
			});
			const { expectEventToBeFired } = renderTeamContainers(teamId);

			await userEvent.hover(screen.getByText(JiraProject.name));
			const crossIconButton = screen.getByRole('button', {
				name: `disconnect the container ${JiraProject.name}`,
			});
			await userEvent.click(crossIconButton);
			expect(await screen.findByTestId('team-containers-disconnect-dialog')).toBeInTheDocument();
			expectEventToBeFired('track', openUnlinkContainerDialogEvent);
		});

		it('should close disconnect dialog and fire analytics event when confirmation dialog proceed', async () => {
			(useTeamLinksAndContainers as jest.Mock).mockReturnValue({
				teamLinks: [JiraProject],
				removeTeamLink: jest.fn(),
			});
			(useTeamContainers as jest.Mock).mockReturnValue({
				unlinkError: null,
			});

			const { expectEventToBeFired } = renderTeamContainers(teamId);

			await userEvent.hover(screen.getByText(JiraProject.name));
			const crossIconButton = screen.getByRole('button', {
				name: 'disconnect the container Jira Project Name',
			});
			await userEvent.click(crossIconButton);

			const disconnectButton = screen.getByRole('button', { name: 'Remove' });
			await userEvent.click(disconnectButton);

			expectEventToBeFired('track', teamContainerUnlinkedSucceededEvent);
		});

		it('should fire failed analytics event when unlink fails', async () => {
			(useTeamLinksAndContainers as jest.Mock).mockReturnValue({
				teamLinks: [JiraProject],
				removeTeamLink: jest.fn(),
			});
			(useTeamContainers as jest.Mock).mockReturnValue({
				unlinkError: 'error',
			});

			const { expectEventToBeFired } = renderTeamContainers(teamId);

			await userEvent.hover(screen.getByText(JiraProject.name));
			const crossIconButton = screen.getByRole('button', {
				name: 'disconnect the container Jira Project Name',
			});
			await userEvent.click(crossIconButton);

			const disconnectButton = screen.getByRole('button', { name: 'Remove' });
			await userEvent.click(disconnectButton);

			expectEventToBeFired('track', teamContainerUnlinkedFailedEvent);
		});
	});

	it('should have no accessibility violations', async () => {
		(useTeamLinksAndContainers as jest.Mock).mockReturnValue({
			teamLinks: [JiraProject, ConfluenceSpace],
		});
		const { container } = renderTeamContainers(teamId);

		await expect(container).toBeAccessible();
	});
});

describe('TeamLinks', () => {
	const teamId = 'teamId';
	const WebLinks = {
		id: 'link-1',
		type: 'WebLink',
		name: 'Google Docs',
		icon: null,
		link: 'https://docs.google.com',
	};
	const JiraProject = {
		id: 'id-1',
		type: 'JiraProject',
		name: 'Jira Project Name',
		icon: 'icon',
		link: 'link',
	};
	const ConfluenceSpace = {
		id: 'id-2',
		type: 'ConfluenceSpace',
		name: 'Confluence Space Name',
		icon: 'icon',
		link: 'link',
	};

	const renderTeamContainers = (
		teamId: string,
		filterContainerId?: string,
		isDisplayedOnProfileCard?: boolean,
		components?: TeamContainersComponent,
		maxNumberOfContainersToShow?: number,
	) => {
		return renderWithIntl(
			<TeamContainers
				teamId={teamId}
				onAddAContainerClick={mockOnAddAContainerClick}
				userId={'test-user-id'}
				cloudId={'test-cloud-id'}
				filterContainerId={filterContainerId}
				isDisplayedOnProfileCard={isDisplayedOnProfileCard}
				components={components}
				maxNumberOfContainersToShow={maxNumberOfContainersToShow}
			/>,
		);
	};

	beforeEach(() => {
		(useTeamContainers as jest.Mock).mockReturnValue({
			teamContainers: [],
			loading: false,
			unlinkError: null,
		});

		(useProductPermissions as jest.Mock).mockReturnValue({
			loading: false,
			data: {
				jira: { manage: true },
				confluence: { manage: true },
			},
			error: null,
		});

		mockFg.mockImplementation((flag) => {
			if (flag === 'enable_web_links_in_team_containers') {
				return true;
			}
			return false;
		});
	});

	it('should render add Jira, Confluence, Web link card when the team has no Jira project, Confluence space and Web links and has product access', () => {
		(useTeamLinksAndContainers as jest.Mock).mockReturnValue({
			teamLinks: [],
			isLoading: false,
			hasLoaded: true,
			hasError: false,
			containersError: false,
			webLinksError: false,
			canAddMoreLink: true,
			addTeamLink: jest.fn(),
			updateTeamLink: jest.fn(),
			removeTeamLink: jest.fn(),
		});
		renderTeamContainers(teamId);

		expect(screen.getByText(messages.addJiraProjectTitle.defaultMessage)).toBeInTheDocument();
		expect(
			screen.getByText(messages.addConfluenceContainerTitle.defaultMessage),
		).toBeInTheDocument();
		expect(
			screen.getByText(messages.emptyLinkContainerDescription.defaultMessage),
		).toBeInTheDocument();
	});

	it('should render add Jira container and web link card when the team has no Jira project and web link, and render linked Confluence space', () => {
		(useTeamLinksAndContainers as jest.Mock).mockReturnValue({
			teamLinks: [ConfluenceSpace],
		});
		renderTeamContainers(teamId);

		expect(screen.getByText(messages.addJiraProjectTitle.defaultMessage)).toBeInTheDocument();
		expect(screen.queryByText(messages.addConfluenceContainerTitle.defaultMessage)).toBeNull();
		expect(screen.getByText(ConfluenceSpace.name)).toBeInTheDocument();
		expect(
			screen.getByText(messages.emptyLinkContainerDescription.defaultMessage),
		).toBeInTheDocument();
	});

	it('should render add Confluence container and web link card when the team has no Confluence space and web link, and render linked Jira project', () => {
		(useTeamLinksAndContainers as jest.Mock).mockReturnValue({
			teamLinks: [JiraProject],
		});
		renderTeamContainers(teamId);

		expect(
			screen.getByText(messages.addConfluenceContainerTitle.defaultMessage),
		).toBeInTheDocument();
		expect(screen.queryByText(messages.addJiraProjectTitle.defaultMessage)).toBeNull();
		expect(screen.getByText(JiraProject.name)).toBeInTheDocument();
		expect(
			screen.getByText(messages.emptyLinkContainerDescription.defaultMessage),
		).toBeInTheDocument();
	});

	it('should render linked containers when jira project, confluence space and web links have linked data', () => {
		(useTeamLinksAndContainers as jest.Mock).mockReturnValue({
			teamLinks: [JiraProject, ConfluenceSpace, WebLinks],
		});
		renderTeamContainers(teamId);

		expect(screen.queryByText(messages.addJiraProjectTitle.defaultMessage)).toBeNull();
		expect(screen.queryByText(messages.addConfluenceContainerTitle.defaultMessage)).toBeNull();
		expect(screen.queryByText(messages.emptyLinkContainerDescription.defaultMessage)).toBeNull();
		expect(screen.getByText(JiraProject.name)).toBeInTheDocument();
		expect(screen.getByText(ConfluenceSpace.name)).toBeInTheDocument();
		expect(screen.getByText(WebLinks.name)).toBeInTheDocument();
		expect(screen.getByText(messages.linkContainerDescription.defaultMessage)).toBeInTheDocument();
	});
});
