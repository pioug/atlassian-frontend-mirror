import React from 'react';

import { cssMap } from '@atlaskit/css';
import { Box, Flex, Inline, Stack, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { type ContainerTypes } from '../../../../common/types';
import { getContainerProperties } from '../../../../common/utils/get-container-properties';

const styles = cssMap({
	container: {
		outlineWidth: token('border.width'),
		outlineColor: token('color.border'),
		outlineStyle: 'solid',
		borderRadius: token('border.radius.100'),
		borderColor: token('color.border.accent.gray'),
		color: token('color.text'),
		paddingTop: token('space.200'),
		paddingRight: token('space.200'),
		paddingBottom: token('space.200'),
		paddingLeft: token('space.200'),
	},
	avatarSkeleton: {
		borderRadius: token('border.radius'),
		paddingTop: token('space.200'),
		paddingRight: token('space.200'),
		paddingBottom: token('space.200'),
		paddingLeft: token('space.200'),
	},
	firstLineSkeleton: {
		borderRadius: token('border.radius.400'),
		paddingBlock: token('space.050'),
	},
	secondLineSkeleton: {
		borderRadius: token('border.radius.400'),
		paddingBlock: token('space.050'),
		width: '144px',
	},
});

export const LinkedContainerCardSkeleton = ({
	containerType,
}: {
	containerType?: ContainerTypes;
}) => {
	return (
		<Box xcss={styles.container}>
			<Inline space="space.100" alignBlock="center">
				<Box backgroundColor="color.background.neutral" xcss={styles.avatarSkeleton} />
				<Stack space="space.100" grow="fill">
					<Box backgroundColor="color.background.neutral" xcss={styles.firstLineSkeleton} />
					{containerType ? (
						<ContainerIcon containerType={containerType} />
					) : (
						<Box backgroundColor="color.background.neutral" xcss={styles.secondLineSkeleton} />
					)}
				</Stack>
			</Inline>
		</Box>
	);
};

function ContainerIcon({ containerType }: { containerType: ContainerTypes }) {
	const { description, icon, containerTypeText } = getContainerProperties({
		containerType,
		iconSize: 'medium',
	});
	return (
		<Flex gap="space.050" alignItems="center">
			{icon}
			<Inline space="space.050">
				<Text size="small" color="color.text.subtle">
					{description}
				</Text>
				<Text size="small" color="color.text.subtle">
					{containerTypeText}
				</Text>
			</Inline>
		</Flex>
	);
}
