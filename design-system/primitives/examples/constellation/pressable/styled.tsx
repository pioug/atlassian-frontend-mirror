/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { cssMap, jsx } from '@atlaskit/css';
import { Box, Flex, Grid, Pressable, Stack, Text, TextColor } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	pressable: {
		paddingTop: token('space.150'),
		paddingRight: token('space.150'),
		paddingBottom: token('space.150'),
		paddingLeft: token('space.150'),
		borderRadius: '3px',
		borderColor: token('color.border'),
		borderWidth: token('border.width'),
		borderStyle: 'solid',
		color: token('color.text'),
		backgroundColor: token('color.background.neutral.subtle'),

		'&:hover': {
			backgroundColor: token('color.background.neutral.subtle.hovered'),
		},
		'&:active': {
			backgroundColor: token('color.background.neutral.subtle.pressed'),
		},
	},

	value: {
		font: token('font.heading.xlarge'),
	},

	grid: {
		'@media (min-width: 48rem)': {
			gridTemplateColumns: '1fr 1fr',
		},
		'@media (min-width: 64rem)': {
			gridTemplateColumns: '1fr 1fr 1fr',
		},
		gridTemplateColumns: '1fr',
		rowGap: token('space.100'),
		columnGap: token('space.100'),
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
		<Pressable xcss={styles.pressable}>
			<Flex as="span" gap="space.150" alignItems="center">
				<Text color={color}>
					<Box as="span" xcss={styles.value}>
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
			<Grid xcss={styles.grid}>
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
