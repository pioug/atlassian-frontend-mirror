import React, { useState } from 'react';

import { useAnalyticsEvents } from '@atlaskit/analytics-next';
import { IconButton } from '@atlaskit/button/new';
import { cssMap } from '@atlaskit/css';
import CrossIcon from '@atlaskit/icon/utility/cross';
import Image from '@atlaskit/image';
import Link from '@atlaskit/link';
import { Box, Flex, Inline, Stack, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { type ContainerTypes } from '../../../common/types';
import { AnalyticsAction, fireUIEvent } from '../../../common/utils/analytics';
import { getContainerProperties } from '../../../common/utils/get-container-properties';

const styles = cssMap({
	container: {
		outlineWidth: token('border.width'),
		outlineColor: token('color.border'),
		outlineStyle: 'solid',
		borderRadius: token('border.radius.100'),
		borderColor: token('color.border.accent.gray'),
		paddingTop: token('space.150'),
		paddingRight: token('space.150'),
		paddingBottom: token('space.150'),
		paddingLeft: token('space.150'),
		color: token('color.text'),
	},
	card: {
		alignItems: 'center',
		width: '100%',
	},
	iconWrapper: {
		width: '32px',
		height: '32px',
		minWidth: '32px',
		minHeight: '32px',
	},
	crossIconWrapper: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'flex-end',
		marginLeft: 'auto',
	},
});

export interface LinkedContainerCardProps {
	containerType: ContainerTypes;
	title: string;
	containerIcon?: string;
	link?: string;
	onDisconnectButtonClick: () => void;
}

interface CustomItemComponentPropsWithHref {
	href: string;
	handleMouseEnter: () => void;
	handleMouseLeave: () => void;
	children: React.ReactNode;
}

const LinkedCardWrapper = ({
	children,
	href,
	handleMouseEnter,
	handleMouseLeave,
}: CustomItemComponentPropsWithHref) => {
	const [hovered, setHovered] = useState(false);
	const onMouseEnter = () => {
		handleMouseEnter();
		setHovered(true);
	};
	const onMouseLeave = () => {
		handleMouseLeave();
		setHovered(false);
	};
	return (
		<Box
			backgroundColor={hovered ? 'color.background.input.hovered' : 'color.background.input'}
			xcss={styles.container}
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
			testId="linked-container-card-inner"
		>
			<Link href={href} appearance="subtle">
				{children}
			</Link>
		</Box>
	);
};

export const LinkedContainerCard = ({
	containerType,
	title,
	containerIcon,
	link,
	onDisconnectButtonClick,
}: LinkedContainerCardProps) => {
	const { createAnalyticsEvent } = useAnalyticsEvents();
	const { description, icon } = getContainerProperties(containerType);
	const [showCloseIcon, setShowCloseIcon] = useState(false);

	return (
		<LinkedCardWrapper
			href={link || '#'}
			handleMouseEnter={() => setShowCloseIcon(true)}
			handleMouseLeave={() => setShowCloseIcon(false)}
		>
			<Inline space="space.100" xcss={styles.card}>
				<Box xcss={styles.iconWrapper}>
					<Image src={containerIcon} alt="" testId="linked-container-icon" />
				</Box>
				<Stack>
					<Text maxLines={1} weight="medium" color="color.text">
						{title}
					</Text>
					<Flex gap="space.050">
						{icon}
						<Text size="small" color="color.text.subtle">
							{description}
						</Text>
					</Flex>
				</Stack>
				{showCloseIcon && (
					<Box xcss={styles.crossIconWrapper}>
						<IconButton
							label={`disconnect the container ${title}`}
							appearance="subtle"
							icon={CrossIcon}
							spacing="compact"
							onClick={(e) => {
								e.preventDefault();
								onDisconnectButtonClick();
								fireUIEvent(createAnalyticsEvent, {
									action: AnalyticsAction.CLICKED,
									actionSubject: 'button',
									actionSubjectId: 'containerUnlinkButton',
								});
							}}
						/>
					</Box>
				)}
			</Inline>
		</LinkedCardWrapper>
	);
};
