import React, { useState } from 'react';

import IconButton from '@atlaskit/button/icon/button';
import { cssMap } from '@atlaskit/css';
import AddIcon from '@atlaskit/icon/core/add';
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
		borderRadius: token('radius.small', '8px'),
		'&:hover': {
			cursor: 'pointer',
		},
	},
	iconWrapper: {
		outlineWidth: token('border.width'),
		outlineColor: token('color.border'),
		outlineStyle: 'dashed',
		borderRadius: token('radius.small'),
		color: token('color.text.subtlest'),
		'&:hover': {
			outlineStyle: 'solid',
			borderColor: token('color.border'),
		},
	},
});

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

/**
 * @deprecated Use the new AddContainerCard component in teams-public/src/next/ui instead.
 */
export const AddContainerCard = ({
	containerType,
	onAddAContainerClick,
	isLoading = false,
	canCreateContainers = false,
}: AddContainerCardProps): React.JSX.Element => {
	const { description, icon, title } = getContainerProperties({
		containerType,
		iconSize: 'medium',
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
				{canCreateContainers ? (
					<AddContainerCardButton type={containerType} />
				) : (
					<Stack space="space.025">
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
export interface AddContainerCardProps {
	containerType: ContainerTypes;
	onAddAContainerClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
	isLoading?: boolean;
	canCreateContainers?: boolean;
}
