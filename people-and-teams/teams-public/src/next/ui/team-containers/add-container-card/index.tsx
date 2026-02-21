import React from 'react';

import { cssMap, cx } from '@atlaskit/css';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box, Inline, Pressable, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { type ContainerTypes } from '../../../../common/types';
import { getContainerProperties } from '../../../../common/utils/get-container-properties';
import { TeamContainerSkeleton } from '../../../common/ui/team-container-skeleton';

const styles = cssMap({
	card: {
		alignItems: 'center',
		width: '100%',
	},
	cardHeight: {
		height: '36px',
	},
	smallCardContainer: {
		paddingTop: token('space.050'),
		paddingBottom: token('space.050'),
	},
	container: {
		paddingTop: token('space.150'),
		paddingRight: token('space.075'),
		paddingBottom: token('space.150'),
		paddingLeft: token('space.075'),
		borderRadius: token('radius.small', '8px'),
		backgroundColor: token('elevation.surface'),
		'&:hover': {
			backgroundColor: token('elevation.surface.hovered'),
		},
	},
	iconWrapper: {
		borderRadius: token('radius.small'),
		color: token('color.text.subtlest'),
	},
});

interface AddContainerCardProps {
	containerType: ContainerTypes;
	onAddAContainerClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
	isLoading?: boolean;
	isDisabled?: boolean;
}

const AddContainerCardWrapper = ({
	children,
	onClick,
	isDisabled,
}: {
	children: React.ReactNode;
	onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
	isDisabled?: boolean;
}) => {
	return (
		<Pressable
			xcss={cx(
				styles.container,
				fg('enable-fix-team-container-height') ? styles.smallCardContainer : null,
			)}
			isDisabled={isDisabled}
			onClick={onClick}
		>
			{children}
		</Pressable>
	);
};

export const AddContainerCard = ({
	containerType,
	onAddAContainerClick,
	isLoading = false,
	isDisabled = false,
}: AddContainerCardProps): React.JSX.Element => {
	const { icon, title } = getContainerProperties({
		containerType,
		isEmptyContainer: true,
	});

	if (isLoading) {
		return <TeamContainerSkeleton numberOfContainers={1} />;
	}

	return (
		<AddContainerCardWrapper onClick={onAddAContainerClick} isDisabled={isDisabled}>
			<Inline
				space="space.100"
				xcss={cx(styles.card, fg('enable-fix-team-container-height') ? styles.cardHeight : null)}
			>
				<Box xcss={styles.iconWrapper}>{icon}</Box>
				<Text maxLines={1} color="color.text.subtlest">
					{title}
				</Text>
			</Inline>
		</AddContainerCardWrapper>
	);
};
