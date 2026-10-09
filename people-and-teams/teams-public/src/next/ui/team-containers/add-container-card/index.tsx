import React from 'react';

import { cssMap } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled/box';
import { Inline } from '@atlaskit/primitives/compiled/inline';
import { Pressable } from '@atlaskit/primitives/compiled/pressable';
import { Text } from '@atlaskit/primitives/compiled/text';
import { token } from '@atlaskit/tokens';

import { type ContainerTypes } from '../../../../common/types';
import { getContainerProperties } from '../../../../common/utils/get-container-properties';
import { TeamContainerSkeleton } from '../../../common/ui/team-container-skeleton';

const styles = cssMap({
	card: {
		alignItems: 'center',
		width: '100%',
		height: '36px',
	},
	container: {
		paddingTop: token('space.050'),
		paddingRight: token('space.075'),
		paddingBottom: token('space.050'),
		paddingLeft: token('space.075'),
		borderRadius: token('radius.small', '8px'),
		backgroundColor: token('elevation.surface'),
		'&:hover': {
			backgroundColor: token('elevation.surface.hovered'),
		},
		transition: token('motion.button.hovered'),
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
	/** Ref to the card's button, e.g. to return focus to it after an overlay it opened closes. */
	buttonRef?: React.Ref<HTMLButtonElement>;
}

const AddContainerCardWrapper = ({
	children,
	onClick,
	isDisabled,
	buttonRef,
}: {
	children: React.ReactNode;
	onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
	isDisabled?: boolean;
	buttonRef?: React.Ref<HTMLButtonElement>;
}) => {
	return (
		<Pressable ref={buttonRef} xcss={styles.container} isDisabled={isDisabled} onClick={onClick}>
			{children}
		</Pressable>
	);
};

export const AddContainerCard = ({
	containerType,
	onAddAContainerClick,
	isLoading = false,
	isDisabled = false,
	buttonRef,
}: AddContainerCardProps): React.JSX.Element => {
	const { icon, title } = getContainerProperties({
		containerType,
		isEmptyContainer: true,
	});

	if (isLoading) {
		return <TeamContainerSkeleton numberOfContainers={1} />;
	}

	return (
		<AddContainerCardWrapper
			onClick={onAddAContainerClick}
			isDisabled={isDisabled}
			buttonRef={buttonRef}
		>
			<Inline space="space.100" xcss={styles.card}>
				<Box xcss={styles.iconWrapper}>{icon}</Box>
				<Text maxLines={1} color="color.text.subtlest">
					{title}
				</Text>
			</Inline>
		</AddContainerCardWrapper>
	);
};
