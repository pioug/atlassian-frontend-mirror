import React, { useState } from 'react';

import { IconButton } from '@atlaskit/button/new';
import { cssMap } from '@atlaskit/css';
import AddIcon from '@atlaskit/icon/utility/add';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box, Flex, Inline, Stack, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { type ContainerTypes } from '../../../common/types';
import { getContainerProperties } from '../../../common/utils/get-container-properties';

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
}: AddContainerCardProps) => {
	const { description, icon, title } = getContainerProperties(containerType);

	return (
		<AddContainerCardWrapper onClick={onAddAContainerClick}>
			<Inline space="space.100" xcss={styles.card}>
				<Box xcss={styles.iconWrapper}>
					<IconButton
						label="Add a container"
						appearance="subtle"
						icon={AddIcon}
						testId="add-icon"
						onClick={(e) => {
							onAddAContainerClick(e);
							e.stopPropagation();
						}}
					/>
				</Box>
				<Stack>
					<Text maxLines={1} weight="medium" color="color.text">
						{title}
					</Text>
					<Flex
						gap="space.050"
						{...(fg('enable_card_alignment_fix') ? { alignItems: 'center' } : {})}
					>
						{icon}
						<Text size="small" color="color.text.subtle">
							{description}
						</Text>
					</Flex>
				</Stack>
			</Inline>
		</AddContainerCardWrapper>
	);
};
