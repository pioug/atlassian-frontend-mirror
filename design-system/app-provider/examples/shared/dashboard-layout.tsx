/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { cssMap, jsx } from '@atlaskit/css';
import Heading from '@atlaskit/heading/heading';
import { Box } from '@atlaskit/primitives/compiled/box';
import { Grid } from '@atlaskit/primitives/compiled/grid';
import { Inline } from '@atlaskit/primitives/compiled/inline';
import { MetricText } from '@atlaskit/primitives/compiled/metric-text';
import { Stack } from '@atlaskit/primitives/compiled/stack';
import { Text } from '@atlaskit/primitives/compiled/text';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	cards: { gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))' },
	card: {
		minWidth: 0,
		borderRadius: token('radius.large'),
		borderWidth: token('border.width'),
		borderStyle: 'solid',
		borderColor: token('color.border'),
	},
});

export function DashboardLayout(): React.JSX.Element {
	return (
		<Stack space="space.gap.xxlarge">
			<Stack space="space.gap.medium">
				<Heading as="h1" size="large">
					Team overview
				</Heading>
				<Text color="color.text.subtle">A snapshot of this week’s work across the team.</Text>
			</Stack>
			<Grid gap="space.gap.xlarge" xcss={styles.cards}>
				{[
					{ label: 'In progress', value: '12', detail: 'Across 3 projects' },
					{ label: 'Completed', value: '28', detail: '8 more than last week' },
					{ label: 'Upcoming', value: '6', detail: 'Due in the next 7 days' },
				].map(({ label, value, detail }) => (
					<Box key={label} padding="space.250" xcss={styles.card}>
						<Stack space="space.gap.large">
							<Text weight="semibold">{label}</Text>
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
			<Grid gap="space.gap.xxlarge" xcss={styles.cards}>
				<Stack space="space.gap.xlarge">
					<Heading as="h3" size="medium">
						Projects
					</Heading>
					{[
						{
							name: 'Website refresh',
							owner: 'Alex Morgan',
							status: 'On track',
							detail: 'Design review on Thursday',
						},
						{
							name: 'Customer onboarding',
							owner: 'Sam Rivera',
							status: 'In progress',
							detail: 'Testing the first-run experience',
						},
						{
							name: 'Design foundations',
							owner: 'Jordan Lee',
							status: 'Planning',
							detail: 'Gathering feedback from teams',
						},
					].map(({ name, owner, status, detail }) => (
						<Box key={name} padding="space.250" xcss={styles.card}>
							<Stack space="space.gap.large">
								<Stack space="space.gap.small">
									<Heading as="h4" size="small">
										{name}
									</Heading>
									<Text size="small" color="color.text.subtle">
										{detail}
									</Text>
								</Stack>
								<Inline spread="space-between" space="space.gap.medium" shouldWrap>
									<Text size="small">{owner}</Text>
									<Text size="small" weight="semibold">
										{status}
									</Text>
								</Inline>
							</Stack>
						</Box>
					))}
				</Stack>
				<Stack space="space.gap.xlarge">
					<Heading as="h3" size="medium">
						Recent activity
					</Heading>
					{[
						{ name: 'Alex shared a design update', detail: 'Website refresh · 10 minutes ago' },
						{ name: 'Sam completed user interviews', detail: 'Customer onboarding · 1 hour ago' },
						{ name: 'Jordan added research notes', detail: 'Design foundations · 2 hours ago' },
						{ name: 'The team finished sprint planning', detail: 'Team space · Yesterday' },
					].map(({ name, detail }) => (
						<Stack key={name} space="space.gap.xxsmall">
							<Text weight="semibold">{name}</Text>
							<Text size="small" color="color.text.subtle">
								{detail}
							</Text>
						</Stack>
					))}
				</Stack>
			</Grid>
		</Stack>
	);
}
