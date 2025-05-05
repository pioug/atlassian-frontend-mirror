import React from 'react';

import { Flex, Grid, Pressable, type TextColor, xcss } from '@atlaskit/primitives';
import Box from '@atlaskit/primitives/box';
import { media } from '@atlaskit/primitives/responsive';
import Stack from '@atlaskit/primitives/stack';
import Text from '@atlaskit/primitives/text';

const pressableStyles = xcss({
	borderRadius: '3px',
	borderColor: 'color.border',
	borderWidth: 'border.width',
	borderStyle: 'solid',
	color: 'color.text',
	backgroundColor: 'color.background.neutral.subtle',

	':hover': {
		backgroundColor: 'color.background.neutral.subtle.hovered',
	},
	':active': {
		backgroundColor: 'color.background.neutral.subtle.pressed',
	},
});

const valueStyles = xcss({
	font: 'font.heading.xlarge',
});

const gridStyles = xcss({
	[media.above.sm]: {
		gridTemplateColumns: '1fr 1fr',
	},
	[media.above.md]: {
		gridTemplateColumns: '1fr 1fr 1fr',
	},
});

const ProjectStatus = ({
	value,
	title,
	subtitle,
	color,
}: {
	value: number;
	title: string;
	subtitle: string;
	color: TextColor;
}) => {
	return (
		<Pressable xcss={pressableStyles} padding="space.150">
			<Flex as="span" gap="space.150" alignItems="center">
				<Text color={color}>
					<Box as="span" xcss={valueStyles}>
						{value}
					</Box>
				</Text>
				<Stack as="span" space="space.0" alignInline="start">
					<Text weight="semibold">{title}</Text>
					<Text size="small" color="color.text.subtlest">
						{subtitle}
					</Text>
				</Stack>
			</Flex>
		</Pressable>
	);
};

export default function Styled() {
	return (
		<Stack space="space.150">
			<Text weight="bold" size="large">
				You're following 5 active projects, here's the breakdown.
			</Text>
			<Grid rowGap="space.100" columnGap="space.100" templateColumns="1fr" xcss={gridStyles}>
				<ProjectStatus
					value={2}
					title="On track"
					subtitle="-1 from last week"
					color="color.text.success"
				/>
				<ProjectStatus
					value={1}
					title="At risk"
					subtitle="+1 from last week"
					color="color.text.warning"
				/>
				<ProjectStatus value={0} title="Off track" subtitle="No change" color="color.text.danger" />
				<ProjectStatus
					value={2}
					title="No update"
					subtitle="+2 from last week"
					color="color.text.discovery"
				/>
				<ProjectStatus value={0} title="Cancelled" subtitle="No change" color="color.text.subtle" />
				<ProjectStatus
					value={1}
					title="Completed"
					subtitle="+1 from last week"
					color="color.text.information"
				/>
			</Grid>
		</Stack>
	);
}
