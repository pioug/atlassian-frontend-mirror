import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { defineMessages, FormattedMessage } from 'react-intl-next';

import { useAnalyticsEvents } from '@atlaskit/analytics-next';
import Button from '@atlaskit/button/new';
import FeatureGates from '@atlaskit/feature-gate-js-client';
import ModalTransition from '@atlaskit/modal-dialog/modal-transition';
import { fg } from '@atlaskit/platform-feature-flags';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Grid, Inline, Stack } from '@atlaskit/primitives';
import {
	hasProductPermission,
	useProductPermissions,
} from '@atlaskit/teams-app-internal-product-permissions';
import { HttpError, teamsClient } from '@atlaskit/teams-client';
import { ContainerType } from '@atlaskit/teams-client/types';
import { N0, N90 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { type ContainerTypes, type TeamContainer } from '../../common/types';
import { TeamContainersSkeleton } from '../../common/ui/team-containers-skeleton';
import { LinkedContainerCardSkeleton } from '../../common/ui/team-containers-skeleton/linked-container-card-skeleton';
import { AnalyticsAction, usePeopleAndTeamAnalytics } from '../../common/utils/analytics';
import { hasProductPermission as hasProductPermissionOld } from '../../controllers';
import { useProductPermissions as useProductPermissionsOld } from '../../controllers/hooks/use-product-permission';
import { useRequestedContainers } from '../../controllers/hooks/use-requested-container';
import {
	useTeamContainers,
	useTeamContainersHook,
} from '../../controllers/hooks/use-team-containers';
import { useTeamLinksAndContainers } from '../../controllers/hooks/use-team-links-and-containers';

import { getAddContainerCards } from './add-container-card';
import { getAddContainerCardsWithCreate } from './add-container-card/add-container-card-with-create';
import { DisconnectDialogLazy } from './disconnect-dialog/async';
import { NoProductAccessState } from './no-product-access-empty-state';
import { TeamLinkCard } from './team-link-card';
import { type TeamContainerProps } from './types';
import { getCreateContainerContactSupportFlag, getCreateContainerTryAgainFlag } from './utils';

export const ICON_BACKGROUND = token('color.icon.inverse', N0);
export const ICON_COLOR = token('color.icon.subtle', N90);
export const MAX_NUMBER_OF_CONTAINERS_TO_SHOW = 4;

interface SelectedContainerDetails {
	containerId: string;
	containerType: ContainerTypes;
	containerName: string;
}

const containerTypeMap: { [key: string]: ContainerType } = {
	Confluence: ContainerType.CONFLUENCE_SPACE,
	Jira: ContainerType.JIRA_PROJECT,
	Loom: ContainerType.LOOM_SPACE,
};

const containerTypeToTextMap: { [key: string]: string } = {
	Confluence: 'Confluence space',
	Jira: 'Jira project',
	Loom: 'Loom space',
};

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
	addFlag,
}: TeamContainerProps) => {
	const { createAnalyticsEvent } = useAnalyticsEvents();
	const { unlinkError, refetchTeamContainers } = useTeamContainers(teamId);
	const {
		teamLinks,
		removeTeamLink,
		iconsLoading,
		iconHasLoaded,
		isLoading: linksLoading,
	} = useTeamLinksAndContainers(teamId, true);
	const { requestedContainers } = useRequestedContainers({
		teamId,
		cloudId,
		onRequestedContainerTimeout,
	});
	const [_, actions] = useTeamContainersHook();
	const [showMore, setShowMore] = useState(false);
	const [isDisconnectDialogOpen, setIsDisconnectDialogOpen] = useState(false);
	const [selectedContainerDetails, setSelectedContainerDetails] = useState<
		SelectedContainerDetails | undefined
	>();
	const [filteredTeamLinks, setFilteredTeamLinks] = useState(teamLinks);

	const [showAddContainer, setShowAddContainer] = useState({
		Jira: false,
		Confluence: false,
		Loom: false,
		WebLink: false,
	});

	const [containersBeingCreated, setContainersBeingCreated] = useState({
		jira: false,
		confluence: false,
		loom: false,
	});

	const { fireOperationalEvent, fireTrackEvent } = usePeopleAndTeamAnalytics();

	const { data: productPermissions, loading: productPermissionIsLoading } = useProductPermissions({
		userId,
		cloudId,
		permissionsToCheck: {
			jira: ['CREATE_PROJECT', 'manage', 'write'],
			loom: ['write', 'manage'],
			confluence: ['write', 'manage'],
		},
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

	const autoCreateExperimentValue: string =
		(FeatureGates.initializeCompleted() &&
			FeatureGates.getExperimentValue('teams_app_auto_container_creation', 'cohort', 'control')) ||
		'';

	useEffect(() => {
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
	}, [teamLinks, isDisplayedOnProfileCard, filterContainerId, requestedContainers]);

	useEffect(() => {
		const containersToCheck = filteredTeamLinks;

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
				permissionIds?: string[],
			) => {
				if (containerExists || isRequesting) {
					return false;
				}

				if (fg('migrate-product-permissions')) {
					return (
						(productPermissions &&
							hasProductPermission(productPermissions, product, permissionIds)) ||
						false
					);
				}
				return (
					(productPermissionsOld &&
						hasProductPermissionOld(productPermissionsOld, product, permissionIds)) ||
					false
				);
			};

			setShowAddContainer({
				Jira: showContainer(
					containerExists('JiraProject'),
					containerRequested('JiraProject'),
					'jira',
					autoCreateExperimentValue === 'profile_page' ? ['CREATE_PROJECT'] : [],
				),
				Confluence: showContainer(
					containerExists('ConfluenceSpace'),
					containerRequested('ConfluenceSpace'),
					'confluence',
					autoCreateExperimentValue === 'profile_page' ? ['write'] : [],
				),
				Loom: showContainer(
					containerExists('LoomSpace'),
					containerRequested('LoomSpace'),
					'loom',
					autoCreateExperimentValue === 'profile_page' ? ['write'] : [],
				),
				WebLink: !containerExists('WebLink'),
			});
		}
	}, [
		isDisplayedOnProfileCard,
		productPermissions,
		productPermissionsOld,
		filteredTeamLinks,
		maxNumberOfContainersToShow,
		requestedContainers,
		autoCreateExperimentValue,
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

	const LinkedContainerCardComponent = components?.ContainerCard || TeamLinkCard;

	const handleDisconnect = useCallback(
		async (containerId: string) => {
			const removedContainer = filteredTeamLinks.find((container) => container.id === containerId);

			if (removedContainer) {
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
			filteredTeamLinks,
			removeTeamLink,
			teamId,
			unlinkError,
		],
	);

	const handleCreateContainer = useCallback(
		async (containerType: 'Confluence' | 'Jira' | 'Loom') => {
			setContainersBeingCreated({
				...containersBeingCreated,
				[containerType.toLowerCase()]: true,
			});
			try {
				const result = await teamsClient.createTeamContainers({
					teamId,
					containers: [{ type: containerTypeMap[containerType], containerSiteId: cloudId }],
				});

				if (result.containersNotCreated.length === 0) {
					fireOperationalEvent(createAnalyticsEvent, {
						action: AnalyticsAction.SUCCEEDED,
						actionSubject: 'teamContainerCreate',
						attributes: {
							containerType,
							teamId,
						},
					});
					refetchTeamContainers();
				} else {
					fireOperationalEvent(createAnalyticsEvent, {
						action: AnalyticsAction.FAILED,
						actionSubject: 'teamContainerCreate',
						attributes: {
							containerType,
							teamId,
						},
					});
					addFlag?.(
						getCreateContainerTryAgainFlag({
							tryAgainAction: () => {
								handleCreateContainer(containerType);
							},
							containerType: containerTypeToTextMap[containerType],
						}),
					);
				}

				setContainersBeingCreated({
					...containersBeingCreated,
					[containerType.toLowerCase()]: false,
				});
			} catch (error) {
				fireOperationalEvent(createAnalyticsEvent, {
					action: AnalyticsAction.FAILED,
					actionSubject: 'teamContainerCreate',
					attributes: {
						containerType,
						teamId,
					},
				});
				if (error instanceof HttpError) {
					if (error.status === 500) {
						addFlag?.(
							getCreateContainerTryAgainFlag({
								tryAgainAction: () => {
									handleCreateContainer(containerType);
								},
								containerType: containerTypeToTextMap[containerType],
							}),
						);
					} else {
						addFlag?.(getCreateContainerContactSupportFlag());
					}
				}
			}
		},
		[
			containersBeingCreated,
			teamId,
			cloudId,
			fireOperationalEvent,
			createAnalyticsEvent,
			refetchTeamContainers,
			addFlag,
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
		return filteredTeamLinks.length === 0;
	}, [filteredTeamLinks]);

	const isLoading = useMemo(() => {
		if (linksLoading) {
			return true;
		}
		if (fg('migrate-product-permissions')) {
			return productPermissionIsLoading;
		}
		return productPermissionIsLoadingOld;
	}, [linksLoading, productPermissionIsLoading, productPermissionIsLoadingOld]);

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
					{filteredTeamLinks.slice(0, maxNumberOfContainersToShow).map((container) => {
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
					})}

					{autoCreateExperimentValue === 'profile_page'
						? getAddContainerCardsWithCreate({
								showAddContainer,
								onCreateContainerClick: (
									e: React.MouseEvent<HTMLButtonElement>,
									containerType: 'Confluence' | 'Jira' | 'Loom' | 'WebLink',
								) => {
									if (containerType !== 'WebLink') {
										handleCreateContainer(containerType);
									}
								},
								containersLoading: containersBeingCreated,
								onAddAContainerClick: (e) => onAddAContainerClick(e, 'WebLink'),
							})
						: getAddContainerCards({
								showAddContainer,
								onAddAContainerClick: onAddAContainerClick,
							})}

					{showMore &&
						filteredTeamLinks.slice(maxNumberOfContainersToShow).map((container) => {
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
						})}
				</Grid>
				{filteredTeamLinks.length > maxNumberOfContainersToShow && (
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
