import React, { useState } from 'react';

import { IconButton } from '@atlaskit/button/new';
import { cssMap } from '@atlaskit/css';
import AddIcon from '@atlaskit/icon/core/add';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box, Flex, Inline, Stack, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { type ContainerTypes } from '../../../common/types';
import { LinkedContainerCardSkeleton } from '../../../common/ui/team-containers-skeleton/linked-container-card-skeleton';
import { getContainerProperties } from '../../../common/utils/get-container-properties';

import { AddContainerCardButton } from './add-container-card-button';

const styles = cssMap({
	card: {
		alignItems: 'center',
		width: '100%',
	},
	container: {
		paddingTop: token('space.150'),
		paddingRight: token('space.150'),
		paddingBottom: token('space.150'),
		paddingLeft: token('space.150'),
		borderRadius: token('border.radius.100', '8px'),
		'&:hover': {
			cursor: 'pointer',
		},
	},
	iconWrapper: {
		outlineWidth: token('border.width'),
		outlineColor: token('color.border'),
		outlineStyle: 'dashed',
		borderRadius: token('border.radius.100'),
		color: token('color.text.subtlest'),
		'&:hover': {
			outlineStyle: 'solid',
			borderColor: token('color.border'),
		},
	},
});

interface AddContainerCardProps {
	containerType: ContainerTypes;
	onAddAContainerClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
	isLoading?: boolean;
	showNewDesign?: boolean;
}

const AddContainerCardWrapper = ({
	children,
	onClick,
}: {
	children: React.ReactNode;
	onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) => {
	const [hovered, setHovered] = useState(false);
	const handleMouseEnter = () => setHovered(true);
	const handleMouseLeave = () => setHovered(false);
	return (
		// eslint-disable-next-line @atlassian/a11y/interactive-element-not-keyboard-focusable
		<Box
			backgroundColor={hovered ? 'elevation.surface.hovered' : 'elevation.surface.sunken'}
			xcss={styles.container}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			onClick={onClick}
		>
			{children}
		</Box>
	);
};

export const AddContainerCard = ({
	containerType,
	onAddAContainerClick,
	isLoading = false,
	showNewDesign = false,
}: AddContainerCardProps) => {
	const { description, icon, title } = getContainerProperties({
		containerType,
		iconSize: fg('enable_medium_size_icons_for_team_link_cards') ? 'medium' : undefined,
		isEmptyContainer: true,
	});

	if (isLoading) {
		return <LinkedContainerCardSkeleton containerType={containerType} />;
	}

	return (
		<AddContainerCardWrapper onClick={onAddAContainerClick}>
			<Inline space="space.100" xcss={styles.card}>
				<Box xcss={styles.iconWrapper}>
					<IconButton
						label="Add a container"
						appearance="subtle"
						icon={(iconProps) => <AddIcon {...iconProps} size="small" />}
						testId="add-icon"
						onClick={(e) => {
							onAddAContainerClick(e);
							e.stopPropagation();
						}}
					/>
				</Box>
				{showNewDesign ? (
					<AddContainerCardButton type={containerType} />
				) : (
					<Stack
						{...(fg('enable_medium_size_icons_for_team_link_cards') ? { space: 'space.025' } : {})}
					>
						<Text maxLines={1} weight="medium" color="color.text">
							{title}
						</Text>
						<Flex gap="space.050" alignItems="center">
							{icon}
							<Text size="small" color="color.text.subtle">
								{description}
							</Text>
						</Flex>
					</Stack>
				)}
			</Inline>
		</AddContainerCardWrapper>
	);
};

type Container = { canAdd: boolean; isLoading: boolean };

type GetAddContainerCardsProps = {
	containers: { Jira: Container; Confluence: Container; Loom: Container; WebLink: Container };
	onAddAContainerClick: (
		e: React.MouseEvent<HTMLButtonElement>,
		containerType: 'Confluence' | 'Jira' | 'Loom' | 'WebLink',
	) => void;
	showNewDesign?: boolean;
};

export const getAddContainerCards = ({
	containers,
	onAddAContainerClick,
	showNewDesign,
}: GetAddContainerCardsProps) => {
	return (
		<>
			{containers.Jira.canAdd && (
				<AddContainerCard
					onAddAContainerClick={(e) => onAddAContainerClick(e, 'Jira')}
					containerType="JiraProject"
					isLoading={containers.Jira.isLoading}
					showNewDesign={showNewDesign}
				/>
			)}
			{containers.Confluence.canAdd && (
				<AddContainerCard
					onAddAContainerClick={(e) => onAddAContainerClick(e, 'Confluence')}
					containerType="ConfluenceSpace"
					isLoading={containers.Confluence.isLoading}
					showNewDesign={showNewDesign}
				/>
			)}
			{containers.Loom.canAdd && fg('loom_tab_in_container_linker_team_profile_page') && (
				<AddContainerCard
					onAddAContainerClick={(e) => onAddAContainerClick(e, 'Loom')}
					containerType="LoomSpace"
					isLoading={containers.Loom.isLoading}
					showNewDesign={showNewDesign}
				/>
			)}
			{containers.WebLink.canAdd && (
				<AddContainerCard
					onAddAContainerClick={(e) => onAddAContainerClick(e, 'WebLink')}
					containerType="WebLink"
					showNewDesign={showNewDesign}
				/>
			)}
		</>
	);
};
