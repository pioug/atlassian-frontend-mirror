import React from 'react';

import { Box } from '@atlaskit/primitives/compiled';

import { AddContainerCard } from './AddContainerCard';
import type { AddContainerCardProps } from './AddContainerCard';

type Container = { canAdd: boolean; isLoading: boolean };

type GetAddContainerCardsProps = {
	containers: { Jira: Container; Confluence: Container; Loom: Container; WebLink: Container };
	onAddAContainerClick: (
		e: React.MouseEvent<HTMLButtonElement>,
		containerType: 'Confluence' | 'Jira' | 'Loom' | 'WebLink',
	) => void;
	CustomAddContainerCard?: React.ComponentType<AddContainerCardProps>;
	canCreateContainers?: boolean;
};

export const getAddContainerCards = ({
	containers,
	onAddAContainerClick,
	CustomAddContainerCard,
	canCreateContainers,
}: GetAddContainerCardsProps): React.JSX.Element => {
	const AddContainerCardComponent = CustomAddContainerCard ?? AddContainerCard;
	const renderCard = (key: string, card: React.ReactNode) => {
		return (
			<Box key={key} role="listitem">
				{card}
			</Box>
		);
	};
	return (
		<>
			{containers.Jira.canAdd &&
				renderCard(
					'jira-add-container',
					<AddContainerCardComponent
						onAddAContainerClick={(e) => onAddAContainerClick(e, 'Jira')}
						containerType="JiraProject"
						isLoading={containers.Jira.isLoading}
						canCreateContainers={canCreateContainers}
					/>,
				)}
			{containers.Confluence.canAdd &&
				renderCard(
					'confluence-add-container',
					<AddContainerCardComponent
						onAddAContainerClick={(e) => onAddAContainerClick(e, 'Confluence')}
						containerType="ConfluenceSpace"
						isLoading={containers.Confluence.isLoading}
						canCreateContainers={canCreateContainers}
					/>,
				)}
			{containers.Loom.canAdd &&
				renderCard(
					'loom-add-container',
					<AddContainerCardComponent
						onAddAContainerClick={(e) => onAddAContainerClick(e, 'Loom')}
						containerType="LoomSpace"
						isLoading={containers.Loom.isLoading}
						canCreateContainers={canCreateContainers}
					/>,
				)}
			{containers.WebLink.canAdd &&
				renderCard(
					'weblink-add-container',
					<AddContainerCardComponent
						onAddAContainerClick={(e) => onAddAContainerClick(e, 'WebLink')}
						containerType="WebLink"
						canCreateContainers={canCreateContainers}
					/>,
				)}
		</>
	);
};
