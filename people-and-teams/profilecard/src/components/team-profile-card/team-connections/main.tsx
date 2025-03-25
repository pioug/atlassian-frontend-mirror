import React from 'react';

import { cssMap } from '@atlaskit/css';
import { Box, Inline, Stack, Text } from '@atlaskit/primitives/compiled';
import { getContainerProperties, type LinkedContainerCardProps } from '@atlaskit/teams-public';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	containerWrapperStyles: {
		display: 'flex',
		alignItems: 'center',
	},
	containerIconStyles: {
		borderRadius: token('border.radius.100'),
		height: '24px',
		width: '24px',
	},
	containerTypeIconButtonStyles: {
		marginLeft: 'auto',
		height: '16px',
		width: '16px',
	},
});

export const TeamConnections = ({
	containerType,
	title,
	containerIcon,
}: LinkedContainerCardProps) => {
	const { description, icon, containerTypeText } = getContainerProperties(containerType, 'medium');
	return (
		<Inline space="space.100" xcss={styles.containerWrapperStyles}>
			<Box
				as="img"
				src={containerIcon}
				alt=""
				testId="linked-container-icon"
				xcss={styles.containerIconStyles}
			/>
			<Stack>
				<Text maxLines={1} color="color.text">
					{title}
				</Text>
				<Inline space="space.050">
					<Text size="small" color="color.text.subtlest">
						{description}
					</Text>
					<Text size="small" color="color.text.subtlest">
						{containerTypeText}
					</Text>
				</Inline>
			</Stack>
			<Box
				backgroundColor={'color.background.neutral.subtle'}
				xcss={styles.containerTypeIconButtonStyles}
				testId="container-type-icon"
			>
				{icon}
			</Box>
		</Inline>
	);
};
