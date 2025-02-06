/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { IconButton } from '@atlaskit/button/new';
import { cssMap, jsx } from '@atlaskit/css';
import AddIcon from '@atlaskit/icon/utility/add';
import { CustomItem, type CustomItemComponentProps } from '@atlaskit/menu';
import { Box, Inline } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

import { ContainerTypes } from '../../../common/types';
import { getContainerProperties } from '../../../common/utils/get-container-properties';

const styles = cssMap({
	container: {
		backgroundColor: token('color.background.input'),
		paddingTop: token('space.150'),
		paddingRight: token('space.150'),
		paddingBottom: token('space.150'),
		paddingLeft: token('space.150'),
		borderRadius: token('border.radius.100'),
		'&:hover': {
			backgroundColor: token('color.background.input.hovered'),
		},
	},
	iconWrapper: {
		outlineWidth: token('border.width'),
		outlineColor: token('color.border'),
		borderStyle: 'dash',
		borderRadius: token('border.radius.100'),
		borderColor: token('color.border.accent.gray'),
		color: token('color.text.subtlest'),
		'&:hover': {
			outlineStyle: 'solid',
			borderColor: token('color.border.accent.gray'),
		},
	},
});

interface AddContainerCardProps {
	containerType: ContainerTypes;
}

const CustomItemInner = ({ children }: CustomItemComponentProps) => {
	return <Box xcss={styles.container}>{children}</Box>;
};

export const AddContainerCard = ({ containerType }: AddContainerCardProps) => {
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
