import React, { useState } from 'react';

import { useAnalyticsEvents } from '@atlaskit/analytics-next';
import { IconButton } from '@atlaskit/button/new';
import { cssMap } from '@atlaskit/css';
import CrossIcon from '@atlaskit/icon/utility/cross';
import Image from '@atlaskit/image';
import Link from '@atlaskit/link';
import { CustomItem, type CustomItemComponentProps } from '@atlaskit/menu';
import { Box, Inline } from '@atlaskit/primitives/compiled';
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
	iconWrapper: { width: '24px', height: '24px' },
});

interface LinkedContainerCardProps {
	containerType: ContainerTypes;
	title: string;
	containerIcon: string;
	link: string;
	onDisconnectButtonClick: () => void;
}

interface CustomItemComponentPropsWithHref extends CustomItemComponentProps {
	href: string;
	handleMouseEnter: () => void;
	handleMouseLeave: () => void;
}

const CustomItemInner = ({
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
		<Link href={href} appearance="subtle">
			<Box
				backgroundColor={hovered ? 'color.background.input.hovered' : 'color.background.input'}
				xcss={styles.container}
				onMouseEnter={onMouseEnter}
				onMouseLeave={onMouseLeave}
				testId="linked-container-card-inner"
			>
				{children}
			</Box>
		</Link>
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
		<CustomItem
			iconBefore={
				<Box xcss={styles.iconWrapper}>
					<Image src={containerIcon} alt="" testId="linked-container-icon" />
				</Box>
			}
			description={
				<Inline space="space.050">
					{icon}
					{description}
				</Inline>
			}
			iconAfter={
				showCloseIcon && (
					<Box>
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
				)
			}
			href={link}
			handleMouseEnter={() => setShowCloseIcon(true)}
			handleMouseLeave={() => setShowCloseIcon(false)}
			component={CustomItemInner}
		>
			{title}
		</CustomItem>
	);
};
