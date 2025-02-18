import React, { useState } from 'react';

import { IconButton } from '@atlaskit/button/new';
import { cssMap } from '@atlaskit/css';
import AddIcon from '@atlaskit/icon/utility/add';
import { CustomItem, type CustomItemComponentProps } from '@atlaskit/menu';
import { Box, Inline } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { type ContainerTypes } from '../../../common/types';
import { getContainerProperties } from '../../../common/utils/get-container-properties';

const styles = cssMap({
	container: {
		paddingTop: token('space.150'),
		paddingRight: token('space.150'),
		paddingBottom: token('space.150'),
		paddingLeft: token('space.150'),
		borderRadius: token('border.radius.100'),
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

const CustomItemInner = ({ children }: CustomItemComponentProps) => {
	const [hovered, setHovered] = useState(false);
	const handleMouseEnter = () => setHovered(true);
	const handleMouseLeave = () => setHovered(false);
	return (
		<Box
			backgroundColor={hovered ? 'elevation.surface.hovered' : 'elevation.surface.sunken'}
			xcss={styles.container}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
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
		<CustomItem
			iconBefore={
				<Box xcss={styles.iconWrapper}>
					<IconButton
						label="Add a container"
						appearance="subtle"
						icon={AddIcon}
						spacing="compact"
						testId="add-icon"
						onClick={(e) => onAddAContainerClick(e)}
					/>
				</Box>
			}
			component={CustomItemInner}
			description={
				<Inline space="space.050">
					{icon}
					{description}
				</Inline>
			}
		>
			{title}
		</CustomItem>
	);
};
