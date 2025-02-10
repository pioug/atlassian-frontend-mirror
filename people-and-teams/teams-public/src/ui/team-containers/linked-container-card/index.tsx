/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { IconButton } from '@atlaskit/button/new';
import { cssMap, jsx } from '@atlaskit/css';
import CrossIcon from '@atlaskit/icon/utility/cross';
import Image from '@atlaskit/image';
import Link from '@atlaskit/link';
import { CustomItem, type CustomItemComponentProps } from '@atlaskit/menu';
import { Box, Inline } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

import { type ContainerTypes } from '../../../common/types';
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

		'&:hover': {
			backgroundColor: token('color.background.input.hovered'),
		},
	},
	iconWrapper: { width: '24px', height: '24px' },
});

interface LinkedContainerCardProps {
	containerType: ContainerTypes;
	title: string;
	containerIcon: string;
}

interface CustomItemComponentPropsWithHref extends CustomItemComponentProps {
	href: string;
}

const CustomItemInner = ({ children, href }: CustomItemComponentPropsWithHref) => {
	return (
		<Link href={href} appearance="subtle">
			<Box xcss={styles.container}>{children}</Box>
		</Link>
	);
};

export const LinkedContainerCard = ({
	containerType,
	title,
	containerIcon,
}: LinkedContainerCardProps) => {
	const { description, icon } = getContainerProperties(containerType);

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
				<Box>
					<IconButton
						label={`disconnect the container ${title}`}
						appearance="subtle"
						icon={CrossIcon}
						spacing="compact"
						onClick={(e) => {
							e.preventDefault();
						}}
					/>
				</Box>
			}
			href="/"
			component={CustomItemInner}
		>
			{title}
		</CustomItem>
	);
};
