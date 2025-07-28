import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { defineMessages, FormattedMessage } from 'react-intl-next';

import { useAnalyticsEvents } from '@atlaskit/analytics-next';
import Button from '@atlaskit/button/new';
import ModalTransition from '@atlaskit/modal-dialog/modal-transition';
import { fg } from '@atlaskit/platform-feature-flags';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Grid, Inline, Stack } from '@atlaskit/primitives';
import {
	hasProductPermission,
	useProductPermissions,
} from '@atlaskit/teams-app-internal-product-permissions';
import { N0, N90 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { type ContainerTypes, type TeamContainer } from '../../common/types';
import { AnalyticsAction, usePeopleAndTeamAnalytics } from '../../common/utils/analytics';
import { hasProductPermission as hasProductPermissionOld } from '../../controllers';
import { useProductPermissions as useProductPermissionsOld } from '../../controllers/hooks/use-product-permission';
import { useRequestedContainers } from '../../controllers/hooks/use-requested-container';
import {
	useTeamContainers,
	useTeamContainersHook,
} from '../../controllers/hooks/use-team-containers';
import { useTeamLinksAndContainers } from '../../controllers/hooks/use-team-links-and-containers';

import { AddContainerCard } from './add-container-card';
import { DisconnectDialogLazy } from './disconnect-dialog/async';
import { LinkedContainerCard } from './linked-container-card';
import { NoProductAccessState } from './no-product-access-empty-state';
import { TeamContainersSkeleton } from './team-containers-skeleton';
import { LinkedContainerCardSkeleton } from './team-containers-skeleton/linked-container-card-skeleton';
import { TeamLinkCard } from './team-link-card';
import { type TeamContainerProps } from './types';

export const ICON_BACKGROUND = token('color.icon.inverse', N0);
export const ICON_COLOR = token('color.icon.subtle', N90);
export const MAX_NUMBER_OF_CONTAINERS_TO_SHOW = 4;

interface SelectedContainerDetails {
	containerId: string;
	containerType: ContainerTypes;
	containerName: string;
}

export const TeamContainers = ({
	teamId,
	onAddAContainerClick,
	onEditContainerClick,
	onRequestedContainerTimeout = () => {},
	components,
	userId,
	cloudId,
	filterContainerId,
	isDisplayedOnProfileCard,
	maxNumberOfContainersToShow = MAX_NUMBER_OF_CONTAINERS_TO_SHOW,
}: TeamContainerProps) => {
	const { createAnalyticsEvent } = useAnalyticsEvents();
	const { teamContainers, loading, unlinkError } = useTeamContainers(teamId);
	const { teamLinks, removeTeamLink, iconsLoading, iconHasLoaded } = useTeamLinksAndContainers(
		teamId,
		true,
	);
	const { requestedContainers } = useRequestedContainers({ teamId, onRequestedContainerTimeout });
	const [_, actions] = useTeamContainersHook();
	const [showMore, setShowMore] = useState(false);
	const [isDisconnectDialogOpen, setIsDisconnectDialogOpen] = useState(false);
	const [selectedContainerDetails, setSelectedContainerDetails] = useState<
		SelectedContainerDetails | undefined
	>();
	const [filteredTeamContainers, setFilteredTeamContainers] = useState(teamContainers);
	const [filteredTeamLinks, setFilteredTeamLinks] = useState(teamLinks);

	const [showAddContainer, setShowAddContainer] = useState({
		Jira: false,
		Confluence: false,
		Loom: false,
		WebLink: false,
	});

	const { fireOperationalEvent, fireTrackEvent } = usePeopleAndTeamAnalytics();

	const { data: productPermissions, loading: productPermissionIsLoading } = useProductPermissions({
		userId,
		cloudId,
		options: {
			enabled: fg('migrate-product-permissions'),
		},
	});

	const { data: productPermissionsOld, loading: productPermissionIsLoadingOld } =
		useProductPermissionsOld(
			{
				userId,
				cloudId,
			},
			{ enabled: !fg('migrate-product-permissions') },
		);

	useEffect(() => {
		if (fg('enable_web_links_in_team_containers')) {
			if (isDisplayedOnProfileCard && filterContainerId) {
				setFilteredTeamLinks(
					teamLinks.filter(
						(container) =>
							container.id !== filterContainerId && !requestedContainers.includes(container.type),
					),
				);
			} else {
				setFilteredTeamLinks(teamLinks);
			}
		} else {
			if (isDisplayedOnProfileCard && filterContainerId) {
				setFilteredTeamContainers(
					teamContainers.filter((container) => container.id !== filterContainerId),
				);
			} else {
				setFilteredTeamContainers(teamContainers);
			}
		}
	}, [teamLinks, teamContainers, isDisplayedOnProfileCard, filterContainerId, requestedContainers]);

	useEffect(() => {
		const containersToCheck = fg('enable_web_links_in_team_containers')
			? filteredTeamLinks
			: filteredTeamContainers;
		if (containersToCheck.length > maxNumberOfContainersToShow || isDisplayedOnProfileCard) {
			setShowAddContainer({ Jira: false, Confluence: false, Loom: false, WebLink: false });
		} else {
			const containerExists = (type: ContainerTypes) =>
				containersToCheck.some((container) => container.type === type);

			const containerRequested = (type: ContainerTypes) => requestedContainers.includes(type);

			const showContainer = (
				containerExists: boolean,
				isRequesting: boolean,
				product: 'confluence' | 'jira' | 'loom',
			) => {
				if (containerExists || isRequesting) {
					return false;
				}

				if (fg('migrate-product-permissions')) {
					return (productPermissions && hasProductPermission(productPermissions, product)) || false;
				}
				return (
					(productPermissionsOld && hasProductPermissionOld(productPermissionsOld, product)) ||
					false
				);
			};

			setShowAddContainer({
				Jira: showContainer(
					containerExists('JiraProject'),
					containerRequested('JiraProject'),
					'jira',
				),
				Confluence: showContainer(
					containerExists('ConfluenceSpace'),
					containerRequested('ConfluenceSpace'),
					'confluence',
				),
				Loom: showContainer(containerExists('LoomSpace'), containerRequested('LoomSpace'), 'loom'),
				WebLink: !containerExists('WebLink'),
			});
		}
	}, [
		isDisplayedOnProfileCard,
		productPermissions,
		productPermissionsOld,
		filteredTeamContainers,
		filteredTeamLinks,
		maxNumberOfContainersToShow,
		requestedContainers,
	]);

	const handleShowMore = () => {
		setShowMore(!showMore);
	};

	const handleOpenDisconnectDialog = useCallback(
		(containerDetails: SelectedContainerDetails) => {
			setSelectedContainerDetails(containerDetails);
			setIsDisconnectDialogOpen(true);

			fireTrackEvent(createAnalyticsEvent, {
				action: AnalyticsAction.OPENED,
				actionSubject: 'unlinkContainerDialog',
				attributes: { teamId },
			});
		},
		[createAnalyticsEvent, fireTrackEvent, teamId],
	);

	const handleEditContainerClick = useCallback(
		(container: TeamContainer) => {
			if (container.type === 'WebLink' && onEditContainerClick) {
				onEditContainerClick(container.id, container.link || '', container.name);
			}
		},
		[onEditContainerClick],
	);

	const LinkedContainerCardComponent =
		components?.ContainerCard ||
		(fg('enable_web_links_in_team_containers') ? TeamLinkCard : LinkedContainerCard);

	const handleDisconnect = useCallback(
		async (containerId: string) => {
			const removedContainer = fg('enable_web_links_in_team_containers')
				? filteredTeamLinks.find((container) => container.id === containerId)
				: filteredTeamContainers.find((container) => container.id === containerId);

			if (removedContainer && fg('enable_web_links_in_team_containers')) {
				await removeTeamLink(removedContainer);
			} else {
				await actions.unlinkTeamContainers(teamId, containerId);
			}

			setIsDisconnectDialogOpen(false);
			if (unlinkError) {
				fireOperationalEvent(createAnalyticsEvent, {
					action: AnalyticsAction.FAILED,
					actionSubject: 'teamContainerUnlinked',
				});
			} else {
				fireOperationalEvent(createAnalyticsEvent, {
					action: AnalyticsAction.SUCCEEDED,
					actionSubject: 'teamContainerUnlinked',
					attributes: {
						containerRemoved: {
							containerId: removedContainer?.id,
							container: removedContainer?.type,
						},
						teamId,
					},
				});
			}
		},
		[
			actions,
			createAnalyticsEvent,
			fireOperationalEvent,
			filteredTeamContainers,
			filteredTeamLinks,
			removeTeamLink,
			teamId,
			unlinkError,
		],
	);

	const TeamContainersSkeletonComponent =
		components?.TeamContainersSkeleton || TeamContainersSkeleton;

	const hasNoPermissions = useMemo(() => {
		if (fg('migrate-product-permissions')) {
			return (
				productPermissions &&
				!hasProductPermission(productPermissions, 'jira') &&
				!hasProductPermission(productPermissions, 'confluence') &&
				!hasProductPermission(productPermissions, 'loom')
			);
		}
		return (
			productPermissionsOld &&
			!hasProductPermissionOld(productPermissionsOld, 'jira') &&
			!hasProductPermissionOld(productPermissionsOld, 'confluence') &&
			!hasProductPermissionOld(productPermissionsOld, 'loom')
		);
	}, [productPermissions, productPermissionsOld]);

	const hasNoContainers = useMemo(() => {
		if (fg('enable_web_links_in_team_containers')) {
			return filteredTeamLinks.length === 0;
		}
		return filteredTeamContainers.length === 0;
	}, [filteredTeamLinks, filteredTeamContainers]);

	const isLoading = useMemo(() => {
		if (loading) {
			return true;
		}
		if (fg('migrate-product-permissions')) {
			return productPermissionIsLoading;
		}
		return productPermissionIsLoadingOld;
	}, [loading, productPermissionIsLoading, productPermissionIsLoadingOld]);

	if (isLoading) {
		return <TeamContainersSkeletonComponent numberOfContainers={maxNumberOfContainersToShow} />;
	}

	if (hasNoContainers && !isDisplayedOnProfileCard && hasNoPermissions) {
		return <NoProductAccessState />;
	}

	return (
		<>
			<Stack space="space.200">
				<Grid
					templateColumns="repeat(auto-fill, minmax(300px, 1fr))"
					gap={isDisplayedOnProfileCard ? 'space.0' : 'space.100'}
				>
					{requestedContainers.map((containerType) => (
						<LinkedContainerCardSkeleton key={containerType} containerType={containerType} />
					))}
					{fg('enable_web_links_in_team_containers')
						? filteredTeamLinks.slice(0, maxNumberOfContainersToShow).map((container) => {
								return (
									<LinkedContainerCardComponent
										key={container.id}
										containerType={container.type}
										containerTypeProperties={container.containerTypeProperties}
										title={container.name}
										containerIcon={container.icon || undefined}
										link={container.link || undefined}
										containerId={container.id}
										iconsLoading={iconsLoading}
										iconHasLoaded={iconHasLoaded}
										onDisconnectButtonClick={() =>
											handleOpenDisconnectDialog({
												containerId: container.id,
												containerType: container.type,
												containerName: container.name,
											})
										}
										onEditLinkClick={() => handleEditContainerClick(container)}
									/>
								);
							})
						: filteredTeamContainers.slice(0, maxNumberOfContainersToShow).map((container) => {
								return (
									<LinkedContainerCardComponent
										key={container.id}
										containerType={container.type}
										containerTypeProperties={container.containerTypeProperties}
										title={container.name}
										containerIcon={container.icon || undefined}
										link={container.link || undefined}
										containerId={container.id}
										onDisconnectButtonClick={() =>
											handleOpenDisconnectDialog({
												containerId: container.id,
												containerType: container.type,
												containerName: container.name,
											})
										}
									/>
								);
							})}
					{showAddContainer.Jira && (
						<AddContainerCard
							onAddAContainerClick={(e) => onAddAContainerClick(e, 'Jira')}
							containerType="JiraProject"
						/>
					)}
					{showAddContainer.Confluence && (
						<AddContainerCard
							onAddAContainerClick={(e) => onAddAContainerClick(e, 'Confluence')}
							containerType="ConfluenceSpace"
						/>
					)}
					{showAddContainer.Loom && fg('loom_tab_in_container_linker_team_profile_page') && (
						<AddContainerCard
							onAddAContainerClick={(e) => onAddAContainerClick(e, 'Loom')}
							containerType="LoomSpace"
						/>
					)}
					{showAddContainer.WebLink && fg('enable_web_links_in_team_containers') && (
						<AddContainerCard
							onAddAContainerClick={(e) => onAddAContainerClick(e, 'WebLink')}
							containerType="WebLink"
						/>
					)}
					{showMore && fg('enable_web_links_in_team_containers')
						? filteredTeamLinks.slice(maxNumberOfContainersToShow).map((container) => {
								return (
									<LinkedContainerCardComponent
										key={container.id}
										containerType={container.type}
										containerTypeProperties={container.containerTypeProperties}
										title={container.name}
										containerId={container.id}
										containerIcon={container.icon || undefined}
										link={container.link || undefined}
										iconsLoading={iconsLoading}
										iconHasLoaded={iconHasLoaded}
										onDisconnectButtonClick={() =>
											handleOpenDisconnectDialog({
												containerId: container.id,
												containerType: container.type,
												containerName: container.name,
											})
										}
										onEditLinkClick={() => handleEditContainerClick(container)}
									/>
								);
							})
						: showMore &&
							filteredTeamContainers.slice(maxNumberOfContainersToShow).map((container) => {
								return (
									<LinkedContainerCardComponent
										key={container.id}
										containerType={container.type}
										containerTypeProperties={container.containerTypeProperties}
										title={container.name}
										containerId={container.id}
										containerIcon={container.icon || undefined}
										link={container.link || undefined}
										onDisconnectButtonClick={() =>
											handleOpenDisconnectDialog({
												containerId: container.id,
												containerType: container.type,
												containerName: container.name,
											})
										}
									/>
								);
							})}
				</Grid>
				{(fg('enable_web_links_in_team_containers')
					? filteredTeamLinks.length
					: filteredTeamContainers.length) > maxNumberOfContainersToShow && (
					<Inline>
						<Button appearance="subtle" onClick={handleShowMore}>
							{showMore ? (
								<FormattedMessage {...messages.showLess} />
							) : (
								<FormattedMessage {...messages.showMore} />
							)}
						</Button>
					</Inline>
				)}
			</Stack>
			<ModalTransition>
				{isDisconnectDialogOpen && selectedContainerDetails && (
					<DisconnectDialogLazy
						containerName={selectedContainerDetails.containerName}
						containerType={selectedContainerDetails.containerType}
						onClose={() => setIsDisconnectDialogOpen(false)}
						onDisconnect={() => handleDisconnect(selectedContainerDetails.containerId)}
					/>
				)}
			</ModalTransition>
		</>
	);
};

const messages = defineMessages({
	showMore: {
		id: 'ptc-directory.team-profile-page.team-containers.show-more',
		defaultMessage: 'Show more',
		description: 'Button to show more containers',
	},
	showLess: {
		id: 'ptc-directory.team-profile-page.team-containers.show-less',
		defaultMessage: 'Show less',
		description: 'Button to show less containers',
	},
});
