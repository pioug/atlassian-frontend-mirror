import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from 'react-intl-next';

import { usePeopleAndTeamAnalytics } from '../../common/utils/analytics';
import { getContainerProperties, messages } from '../../common/utils/get-container-properties';
import { useProductPermissions } from '../../controllers/hooks/use-product-permission';
import {
	useTeamContainers,
	useTeamContainersHook,
} from '../../controllers/hooks/use-team-containers';

import { TeamContainers } from './main';
import { TeamContainersComponent } from './types';

jest.mock('../../controllers/hooks/use-team-containers', () => ({
	...jest.requireActual('../../controllers/hooks/use-team-containers'),
	useTeamContainers: jest.fn(),
	useTeamContainersHook: jest.fn().mockReturnValue([]),
}));

jest.mock('../../controllers/hooks/use-product-permission', () => ({
	useProductPermissions: jest.fn(),
}));

jest.mock('../../common/utils/analytics', () => ({
	...jest.requireActual('../../common/utils/analytics'),
	usePeopleAndTeamAnalytics: jest.fn(() => ({
		fireTrackEvent: jest.fn(),
		fireOperationalEvent: jest.fn(),
		fireUIEvent: jest.fn(),
	})),
}));

const renderWithIntl = (node: React.ReactNode) => {
	return render(<IntlProvider locale="en">{node}</IntlProvider>);
};

const mockFireTrackEvent = jest.fn();
const mockFireOperationalEvent = jest.fn();
const mockFireUIEvent = jest.fn();

const mockOnAddAContainerClick = jest.fn();

describe('getContainerProperties', () => {
	it('should return correct properties for confluence container type', () => {
		const properties = getContainerProperties('ConfluenceSpace');
		renderWithIntl(properties.description);
		expect(
			screen.getByText(messages.confluenceContainerDescription.defaultMessage),
		).toBeInTheDocument();
		expect(properties.icon).toBeTruthy();
		const { getByText: getByTextTitle } = renderWithIntl(properties.title);
		expect(getByTextTitle(messages.addConfluenceContainerTitle.defaultMessage)).toBeInTheDocument();
	});

	it('should return correct properties for jira container type', () => {
		const properties = getContainerProperties('JiraProject');
		renderWithIntl(properties.description);
		expect(screen.getByText(messages.jiraProjectDescription.defaultMessage)).toBeInTheDocument();
		expect(properties.icon).toBeTruthy();
		const { getByText: getByTextTitle } = renderWithIntl(properties.title);
		expect(getByTextTitle(messages.addJiraProjectTitle.defaultMessage)).toBeInTheDocument();
	});
});

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
		(usePeopleAndTeamAnalytics as jest.Mock).mockReturnValue({
			fireTrackEvent: mockFireTrackEvent,
			fireOperationalEvent: mockFireOperationalEvent,
			fireUIEvent: mockFireUIEvent,
		});
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
		(useTeamContainers as jest.Mock).mockReturnValue({
			teamContainers: [],
		});

		renderTeamContainers(teamId);

		expect(screen.getByText(messages.addJiraProjectTitle.defaultMessage)).toBeInTheDocument();
		expect(
			screen.getByText(messages.addConfluenceContainerTitle.defaultMessage),
		).toBeInTheDocument();
	});

	it('should render add Jira and Confluence container card when the team has no Jira project and Confluence space linked and has no product access', async () => {
		(useTeamContainers as jest.Mock).mockReturnValue({
			teamContainers: [],
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
		(useTeamContainers as jest.Mock).mockReturnValue({
			teamContainers: [],
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
		(useTeamContainers as jest.Mock).mockReturnValue({
			teamContainers: [JiraProject, ConfluenceSpace],
		});
		renderTeamContainers(teamId);

		expect(screen.queryByText(messages.addJiraProjectTitle.defaultMessage)).toBeNull();
		expect(screen.queryByText(messages.addConfluenceContainerTitle.defaultMessage)).toBeNull();
		expect(screen.getByText(JiraProject.name)).toBeInTheDocument();
		expect(screen.getByText(ConfluenceSpace.name)).toBeInTheDocument();
	});

	it('should NOT render add Jira and Confluence container card when displayed from a profile card', () => {
		(useTeamContainers as jest.Mock).mockReturnValue({
			teamContainers: [JiraProject, ConfluenceSpace],
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
		(useTeamContainers as jest.Mock).mockReturnValue({
			teamContainers: [ConfluenceSpace],
		});
		renderTeamContainers(teamId);

		expect(screen.getByText(messages.addJiraProjectTitle.defaultMessage)).toBeInTheDocument();
		expect(screen.queryByText(messages.addConfluenceContainerTitle.defaultMessage)).toBeNull();
		expect(screen.getByText(ConfluenceSpace.name)).toBeInTheDocument();
	});

	it('should render add Confluence container card when the team has no Confluence space linked, and render linked Jira project', () => {
		(useTeamContainers as jest.Mock).mockReturnValue({
			teamContainers: [JiraProject],
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
		(useTeamContainers as jest.Mock).mockReturnValue({
			teamContainers,
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
		(useTeamContainers as jest.Mock).mockReturnValue({
			teamContainers,
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

		(useTeamContainers as jest.Mock).mockReturnValue({
			teamContainers: teamContainers.filter((container) => container.id !== mockFilterContainerId),
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
		(useTeamContainers as jest.Mock).mockReturnValue({
			teamContainers: [
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
		(useTeamContainers as jest.Mock).mockReturnValue({
			loading: true,
			teamContainers: [],
		});
		renderTeamContainers(teamId);

		expect(screen.getByTestId('team-containers-skeleton')).toBeInTheDocument();
	});

	it('should show a custom skeleton component if passed in', () => {
		(useTeamContainers as jest.Mock).mockReturnValue({
			loading: true,
			teamContainers: [],
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
		(useTeamContainers as jest.Mock).mockReturnValue({
			teamContainers: [JiraProject],
		});
		renderTeamContainers(teamId);

		expect(screen.queryByTestId('team-containers-disconnect-dialog')).toBeNull();
	});

	it('should render disconnect dialog when disconnect button is clicked', async () => {
		(useTeamContainers as jest.Mock).mockReturnValue({
			teamContainers: [JiraProject],
		});
		renderTeamContainers(teamId);

		await userEvent.hover(screen.getByText(JiraProject.name));
		const crossIconButton = screen.getByRole('button', {
			name: `disconnect the container ${JiraProject.name}`,
		});
		await userEvent.click(crossIconButton);
		expect(await screen.findByTestId('team-containers-disconnect-dialog')).toBeInTheDocument();
	});

	it('should open disconnect dialog when disconnect button is clicked', async () => {
		(useTeamContainers as jest.Mock).mockReturnValue({
			teamContainers: [JiraProject],
		});
		renderTeamContainers(teamId);

		await userEvent.hover(screen.getByText(JiraProject.name));
		const crossIconButton = screen.getByRole('button', {
			name: `disconnect the container ${JiraProject.name}`,
		});
		await userEvent.click(crossIconButton);
		expect(await screen.findByTestId('team-containers-disconnect-dialog')).toBeInTheDocument();
		expect(mockFireTrackEvent).toHaveBeenCalledTimes(1);
		expect(mockFireTrackEvent).toHaveBeenCalledWith(expect.any(Function), {
			action: 'opened',
			actionSubject: 'unlinkContainerDialog',
			attributes: {
				teamId: 'teamId',
			},
		});
	});

	it('should close disconnect dialog and fire analytics event when confirmation dialog proceed', async () => {
		(useTeamContainers as jest.Mock).mockReturnValue({
			teamContainers: [JiraProject],
		});
		(useTeamContainersHook as jest.Mock).mockReturnValue([
			{
				unlinkError: null,
			},
			{ unlinkTeamContainers: jest.fn() },
		]);
		renderTeamContainers(teamId);

		await userEvent.hover(screen.getByText(JiraProject.name));
		const crossIconButton = screen.getByRole('button', {
			name: `disconnect the container ${JiraProject.name}`,
		});
		await userEvent.click(crossIconButton);

		const disconnectButton = screen.getByRole('button', { name: 'Remove' });
		await userEvent.click(disconnectButton);

		expect(mockFireOperationalEvent).toHaveBeenCalledTimes(1);
		expect(mockFireOperationalEvent).toHaveBeenCalledWith(expect.any(Function), {
			action: 'succeeded',
			actionSubject: 'teamContainerUnlinked',
			attributes: {
				containerRemoved: {
					container: 'JiraProject',
					containerId: 'id-1',
				},
				teamId: 'teamId',
			},
		});
	});

	it('should have no accessibility violations', async () => {
		(useTeamContainers as jest.Mock).mockReturnValue({
			teamContainers: [JiraProject, ConfluenceSpace],
		});
		const { container } = renderTeamContainers(teamId);

		await expect(container).toBeAccessible();
	});
});
