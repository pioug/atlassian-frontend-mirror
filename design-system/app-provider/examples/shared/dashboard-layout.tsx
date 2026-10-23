/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { cssMap, cx, jsx } from '@atlaskit/css';
import Heading from '@atlaskit/heading/heading';
import CalendarIcon from '@atlaskit/icon/core/calendar';
import CheckMarkIcon from '@atlaskit/icon/core/check-mark';
import ProjectIcon from '@atlaskit/icon/core/project';
import Lozenge from '@atlaskit/lozenge/lozenge';
import { Box } from '@atlaskit/primitives/compiled/box';
import { Grid } from '@atlaskit/primitives/compiled/grid';
import { Inline } from '@atlaskit/primitives/compiled/inline';
import { MetricText } from '@atlaskit/primitives/compiled/metric-text';
import { Stack } from '@atlaskit/primitives/compiled/stack';
import { Text } from '@atlaskit/primitives/compiled/text';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	root: {
		// eslint-disable-next-line @atlaskit/platform/expand-spacing-shorthand -- Inset tokens require equal padding on all sides.
		padding: token('space.inset.xxlarge'),
		backgroundColor: token('elevation.surface.sunken'),
		borderRadius: token('radius.large'),
		overflowWrap: 'anywhere',
	},
	metrics: { gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 170px), 1fr))' },
	columns: {
		gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
		alignItems: 'start',
	},
	surface: {
		minWidth: 0,
		backgroundColor: token('elevation.surface'),
		borderRadius: token('radius.large'),
		borderWidth: token('border.width'),
		borderStyle: 'solid',
		borderColor: token('color.border'),
	},
	metric: {
		// eslint-disable-next-line @atlaskit/platform/expand-spacing-shorthand -- Inset tokens require equal padding on all sides.
		padding: token('space.inset.medium'),
	},
	project: {
		// eslint-disable-next-line @atlaskit/platform/expand-spacing-shorthand -- Inset tokens require equal padding on all sides.
		padding: token('space.inset.large'),
	},
	panel: {
		// eslint-disable-next-line @atlaskit/platform/expand-spacing-shorthand -- Inset tokens require equal padding on all sides.
		padding: token('space.inset.xlarge'),
	},
	activity: {
		// eslint-disable-next-line @atlaskit/platform/expand-spacing-shorthand -- Inset tokens require equal padding on all sides.
		padding: token('space.inset.small'),
		backgroundColor: token('elevation.surface.sunken'),
		borderRadius: token('radius.medium'),
	},
	metricIcon: {
		display: 'flex',
		// eslint-disable-next-line @atlaskit/platform/expand-spacing-shorthand -- Inset tokens require equal padding on all sides.
		padding: token('space.inset.xxsmall'),
		backgroundColor: token('color.background.accent.blue.subtlest'),
		borderRadius: token('radius.small'),
	},
	projectIcon: {
		display: 'flex',
		// eslint-disable-next-line @atlaskit/platform/expand-spacing-shorthand -- Inset tokens require equal padding on all sides.
		padding: token('space.inset.xsmall'),
		backgroundColor: token('color.background.accent.purple.subtlest'),
		borderRadius: token('radius.medium'),
	},
	content: { minWidth: 0 },
	barTrack: {
		display: 'block',
		backgroundColor: token('color.background.neutral'),
		borderRadius: token('radius.full'),
		overflow: 'hidden',
	},
	bar: { fill: token('color.chart.brand') },
});

export function DashboardLayout(): React.JSX.Element {
	return (
		<Stack space="space.gap.xxlarge" xcss={styles.root}>
			<Stack space="space.gap.medium">
				<Heading as="h1" size="large">
					Project overview
				</Heading>
				<Text color="color.text.subtle">A snapshot of this week’s work across the team.</Text>
			</Stack>
			<Grid gap="space.gap.xlarge" xcss={styles.metrics}>
				{[
					{ label: 'In progress', value: '12', detail: 'Across 3 projects', icon: ProjectIcon },
					{ label: 'Completed', value: '28', detail: '8 more than last week', icon: CheckMarkIcon },
					{ label: 'Upcoming', value: '6', detail: 'Due in the next 7 days', icon: CalendarIcon },
				].map(({ label, value, detail, icon: Icon }) => (
					<Box key={label} xcss={cx(styles.surface, styles.metric)}>
						<Stack space="space.gap.large">
							<Inline space="space.gap.medium" alignBlock="center" shouldWrap>
								<Box xcss={styles.metricIcon}>
									<Icon label="" size="small" color={token('color.icon.accent.blue')} />
								</Box>
								<Text weight="semibold">{label}</Text>
							</Inline>
							<Stack space="space.gap.xsmall">
								<MetricText size="large">{value}</MetricText>
								<Text size="small" color="color.text.subtle">
									{detail}
								</Text>
							</Stack>
						</Stack>
					</Box>
				))}
			</Grid>
			<Grid gap="space.gap.xxlarge" xcss={styles.columns}>
				<Stack space="space.gap.xlarge" xcss={styles.content}>
					<Heading as="h2" size="medium">
						Projects
					</Heading>
					{[
						{
							name: 'Website refresh',
							owner: 'Alex Morgan',
							status: 'On track',
							appearance: 'success' as const,
							detail: 'Design review on Thursday',
						},
						{
							name: 'Customer onboarding',
							owner: 'Sam Rivera',
							status: 'In progress',
							appearance: 'inprogress' as const,
							detail: 'Testing the first-run experience',
						},
						{
							name: 'Design foundations',
							owner: 'Jordan Lee',
							status: 'Planning',
							appearance: 'default' as const,
							detail: 'Gathering feedback from teams',
						},
					].map(({ name, owner, status, appearance, detail }) => (
						<Box key={name} xcss={cx(styles.surface, styles.project)}>
							<Stack space="space.gap.large">
								<Inline space="space.gap.large" alignBlock="center" shouldWrap>
									<Box xcss={styles.projectIcon}>
										<ProjectIcon label="" color={token('color.icon.accent.purple')} />
									</Box>
									<Heading as="h3" size="small">
										{name}
									</Heading>
								</Inline>
								<Text size="small" color="color.text.subtle">
									{detail}
								</Text>
								<Inline spread="space-between" space="space.gap.medium" shouldWrap>
									<Text size="small">{owner}</Text>
									<Lozenge appearance={appearance}>{status}</Lozenge>
								</Inline>
							</Stack>
						</Box>
					))}
				</Stack>
				<Stack space="space.gap.xlarge" xcss={styles.content}>
					<Box xcss={cx(styles.surface, styles.panel)}>
						<Stack space="space.gap.xlarge">
							<Stack space="space.gap.xsmall">
								<Heading as="h2" size="small">
									Completed this week
								</Heading>
								<Text size="small" color="color.text.subtle">
									28 work items across the team
								</Text>
							</Stack>
							{[
								{ day: 'Monday', count: 4 },
								{ day: 'Tuesday', count: 7 },
								{ day: 'Wednesday', count: 5 },
								{ day: 'Thursday', count: 8 },
								{ day: 'Friday', count: 4 },
							].map(({ day, count }) => (
								<Stack key={day} space="space.gap.small">
									<Inline spread="space-between" space="space.gap.medium" shouldWrap>
										<Text size="small">{day}</Text>
										<Text size="small" weight="semibold">
											{count}
										</Text>
									</Inline>
									<svg aria-hidden="true" width="100%" height="8" css={styles.barTrack}>
										<rect width={`${(count / 8) * 100}%`} height="8" css={styles.bar} />
									</svg>
								</Stack>
							))}
						</Stack>
					</Box>
					<Stack space="space.gap.xlarge" xcss={cx(styles.surface, styles.panel)}>
						<Heading as="h2" size="small">
							Recent activity
						</Heading>
						{[
							{ name: 'Alex shared a design update', detail: 'Website refresh · 10 minutes ago' },
							{ name: 'Sam completed user interviews', detail: 'Customer onboarding · 1 hour ago' },
							{ name: 'Jordan added research notes', detail: 'Design foundations · 2 hours ago' },
							{ name: 'The team finished sprint planning', detail: 'Team space · Yesterday' },
						].map(({ name, detail }) => (
							<Stack key={name} space="space.gap.xxsmall" xcss={styles.activity}>
								<Text weight="semibold">{name}</Text>
								<Text size="small" color="color.text.subtle">
									{detail}
								</Text>
							</Stack>
						))}
					</Stack>
				</Stack>
			</Grid>
		</Stack>
	);
}
