import { type ComponentType } from 'react';

import { type OnRequestedContainerTimeout } from '../../controllers/hooks/use-requested-container';

import { type LinkedContainerCardProps } from './linked-container-card';
import { type TeamContainersSkeletonProps } from './team-containers-skeleton';

export interface TeamContainerProps {
	/**
	 * The team id to fetch the team container for
	 */
	teamId: string;
	/**
	 * The function to call when the add a container button is clicked
	 */
	onAddAContainerClick: (
		e: React.MouseEvent<HTMLButtonElement>,
		containerType: 'Confluence' | 'Jira' | 'Loom' | 'WebLink',
	) => void;
	/**
	 * The function to call when the edit container button is clicked
	 */
	onEditContainerClick?: (
		containerId: string,
		containerLink: string,
		containerTitle: string,
	) => void;
	/**
	 * The component to replace current components
	 */
	components?: TeamContainersComponent;
	/**
	 * The user id of the current user
	 */
	userId: string;
	/**
	 * The cloud id of the current site
	 */
	cloudId: string;
	/**
	 * The container id to filter out from the list
	 */
	filterContainerId?: string;
	/**
	 * The container id to filter out from the list
	 */
	isDisplayedOnProfileCard?: boolean;
	/**
	 * The maximum number of containers to show
	 */
	maxNumberOfContainersToShow?: number;
	/**
	 * The function to call when the requested container times out
	 */
	onRequestedContainerTimeout?: OnRequestedContainerTimeout;
}

export interface TeamContainersComponent {
	ContainerCard: ComponentType<LinkedContainerCardProps>;
	TeamContainersSkeleton: ComponentType<TeamContainersSkeletonProps>;
}
