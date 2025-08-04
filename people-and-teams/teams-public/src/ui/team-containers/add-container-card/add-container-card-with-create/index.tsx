import React, { useState } from 'react';

import { defineMessages, FormattedMessage } from 'react-intl-next';

import Button, { IconButton } from '@atlaskit/button/new';
import { cssMap } from '@atlaskit/css';
import AddIcon from '@atlaskit/icon/core/add';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box, Flex, Inline, Stack, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { type ContainerTypes } from '../../../../common/types';
import { LinkedContainerCardSkeleton } from '../../../../common/ui/team-containers-skeleton/linked-container-card-skeleton';

import { getContainerProperties } from './utils';

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

	createButtonWrapper: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'flex-end',
		marginLeft: 'auto',
		borderRadius: token('border.radius.100', '4px'),
		outlineColor: token('color.border'),
		outlineStyle: 'solid',
	},
	iconWrapper: {
		width: '34px',
		height: '34px',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: token('border.radius.200', '8px'),
		outlineColor: token('color.border'),
		outlineStyle: 'solid',
	},
});

interface AAddContainerCardWithCreateProps {
	containerType: ContainerTypes;
	onCreateContainerClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
	isLoading?: boolean;
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

export const AddContainerCardWithCreate = ({
	containerType,
	onCreateContainerClick,
	isLoading,
}: AAddContainerCardWithCreateProps) => {
	const { description, icon, title } = getContainerProperties({
		containerType,
	});
	if (isLoading) {
		return <LinkedContainerCardSkeleton />;
	}

	return (
		<AddContainerCardWrapper onClick={onCreateContainerClick}>
			<Inline space="space.100" xcss={styles.card}>
				<Box xcss={styles.iconWrapper}>{icon}</Box>
				<Stack
					{...(fg('enable_medium_size_icons_for_team_link_cards') ? { space: 'space.025' } : {})}
				>
					<Text maxLines={1} weight="medium" color="color.text">
						{title}
					</Text>
					<Flex gap="space.050" alignItems="center">
						<Text size="small" color="color.text.subtle">
							{description}
						</Text>
					</Flex>
				</Stack>
				<Box xcss={styles.createButtonWrapper}>
					<Button
						appearance="subtle"
						testId="add-create-icon"
						onClick={(e) => {
							onCreateContainerClick(e);
							e.stopPropagation();
						}}
					>
						<FormattedMessage {...messages.createLinkButtonText} />
					</Button>
				</Box>
			</Inline>
		</AddContainerCardWrapper>
	);
};

export const getAddContainerCardsWithCreate = ({
	showAddContainer,
	onCreateContainerClick,
	onAddAContainerClick,
	containersLoading,
}: {
	showAddContainer: { Jira: boolean; Confluence: boolean; Loom: boolean; WebLink: boolean };
	onCreateContainerClick: (
		e: React.MouseEvent<HTMLButtonElement>,
		containerType: 'Confluence' | 'Jira' | 'Loom' | 'WebLink',
	) => void;
	containersLoading: { jira: boolean; confluence: boolean; loom: boolean };
	onAddAContainerClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) => {
	return (
		<>
			{showAddContainer.Jira && (
				<AddContainerCardWithCreate
					onCreateContainerClick={(e) => {
						onCreateContainerClick(e, 'Jira');
					}}
					containerType="JiraProject"
					isLoading={containersLoading.jira}
				/>
			)}
			{showAddContainer.Confluence && (
				<AddContainerCardWithCreate
					onCreateContainerClick={(e) => {
						onCreateContainerClick(e, 'Confluence');
					}}
					containerType="ConfluenceSpace"
					isLoading={containersLoading.confluence}
				/>
			)}
			{showAddContainer.Loom && (
				<AddContainerCardWithCreate
					onCreateContainerClick={(e) => {
						onCreateContainerClick(e, 'Loom');
					}}
					containerType="LoomSpace"
					isLoading={containersLoading.loom}
				/>
			)}
			{(showAddContainer.Loom || showAddContainer.Jira || showAddContainer.Confluence) && (
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
						<Stack space={'space.025'}>
							<Text maxLines={1} weight="medium" color="color.text">
								<FormattedMessage {...messages.addExistingLinkTitle} />
							</Text>
						</Stack>
					</Inline>
				</AddContainerCardWrapper>
			)}
		</>
	);
};

export const messages = defineMessages({
	createLinkButtonText: {
		id: 'ptc-directory.team-profile-page.team-containers.add-confluence-space-title',
		defaultMessage: 'Create',
		description: 'Title of the card to add a Confluence space to a team',
	},
	addExistingLinkTitle: {
		id: 'ptc-directory.team-profile-page.team-containers.add-confluence-space-title',
		defaultMessage: 'Add an existing space',
		description: 'Title of the card to add a Confluence space to a team',
	},
});
