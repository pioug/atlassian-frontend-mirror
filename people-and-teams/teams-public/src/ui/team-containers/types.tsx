import { type ComponentType } from 'react';

import { type LinkedContainerCardProps } from './linked-container-card';

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
		containerType: 'Confluence' | 'Jira',
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
}

export interface TeamContainersComponent {
	ContainerCard: ComponentType<LinkedContainerCardProps>;
}
