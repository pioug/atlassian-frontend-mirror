import { type ComponentType } from 'react';

import type { GridProps } from '@atlaskit/primitives/compiled';

import { type TeamContainersSkeletonProps } from '../../common/ui/team-containers-skeleton';
import { type OnRequestedContainerTimeout } from '../../controllers/hooks/use-requested-container';

import type { AddContainerCardProps } from './add-container-card';
import { type LinkedContainerCardProps } from './linked-container-card';

export type FlagType = FlagAppearance;

type FlagAppearance = 'error' | 'info' | 'normal' | 'success' | 'warning';

export interface Flag {
	id: number | string;
	title?: string | React.ReactNode;
	description?: string | React.ReactNode;
	type?: FlagType;
	appearance?: FlagAppearance;
	actions?: {
		content: React.ReactNode;
		onClick?: () => void;
		href?: string;
		target?: string;
	}[];
	icon?: JSX.Element;
}

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

	addFlag?: (flag: Flag) => void;
	isReadOnly?: boolean;

	onError?: (error: Error | boolean) => void;
	/**
	 * Component to render in the grid before any results
	 **/
	elemBeforeCards?: ComponentType<{}>;
	/**
	 * Whether to hide the subtext icon
	 */
	hideSubTextIcon?: boolean;
}

export interface TeamContainersEmptyStateProps {
	hasNoPermissions?: boolean;
}

export interface TeamContainersEmptyStateProps {
	hasNoPermissions?: boolean;
}
export interface TeamContainersComponent {
	ContainerCard?: ComponentType<LinkedContainerCardProps>;
	TeamContainersSkeleton?: ComponentType<TeamContainersSkeletonProps>;
	TeamContainersEmptyState?: ComponentType<TeamContainersEmptyStateProps>;
	AddContainerCard?: ComponentType<AddContainerCardProps>;
	Grid?: ComponentType<GridProps>;
}
