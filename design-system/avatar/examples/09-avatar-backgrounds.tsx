/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React from 'react';

import Avatar, { type AppearanceType, type PresenceType, type StatusType } from '@atlaskit/avatar';
import { Code } from '@atlaskit/code';
import { cssMap, jsx } from '@atlaskit/css';
import Heading from '@atlaskit/heading';
import { fg } from '@atlaskit/platform-feature-flags';
import { Grid, Stack, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import loomCircleImage from '../examples-util/loom-circle.svg';
import ExampleImg from '../examples-util/nucleus.png';

const avatarUrl: string =
	'https://pbs.twimg.com/profile_images/803832195970433027/aaoG6PJI_400x400.jpg';

const exampleColors = [token('color.background.neutral'), token('color.background.input.pressed')];

const gradientBorders = [
	'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
	'conic-gradient(from 0deg, #ff6b6b, #feca57, #48dbfb, #ff9ff3, #ff6b6b)',
];

const presences: PresenceType[] = ['focus', 'online', 'offline', 'busy'];
const statuses: StatusType[] = ['approved', 'locked', 'declined'];

const styles = cssMap({
	column: {
		display: 'flex',
		flex: 1,
		flexDirection: 'column',
		paddingBlockEnd: token('space.100'),
		paddingInlineStart: token('space.200'),
		paddingInlineEnd: token('space.200'),
		paddingBlockStart: token('space.100'),
	},
	grid: {
		gridTemplateColumns: '1fr 1fr',
	},
	gradientCircle: {
		borderRadius: token('radius.full', '50%'),
		display: 'inline-flex',
	},
	gradientSquare: {
		borderRadius: token('radius.small', '26px'),
		display: 'inline-flex',
	},
});
interface ColorColumn {
	borderColor: string;
	src: string;
	presence?: PresenceType;
	appearance?: AppearanceType;
	status?: StatusType;
	key?: number;
}

const ColorColumn = ({ key, src, borderColor, presence, status, appearance }: ColorColumn) => (
	<div style={{ background: `${borderColor}` }}>
		<Stack alignBlock="center" alignInline="center" space="space.500" xcss={styles.column}>
			<Avatar
				onClick={console.log}
				key={key}
				src={src}
				borderColor={borderColor}
				status={status}
				presence={presence}
				appearance={appearance}
				size="xlarge"
				name="John Smith ACME Co."
			/>
			<Avatar
				onClick={console.log}
				key={key}
				src={src}
				borderColor={borderColor}
				status={status}
				presence={presence}
				appearance={appearance}
				name="John Smith ACME Co."
			/>
		</Stack>
	</div>
);

const _default: () => JSX.Element = () => (
	<Stack space="space.200">
		<Heading as="h2" size="large">
			Coloured Backgrounds
		</Heading>

		<Text size="large" color="color.text.subtlest">
			<Text as="p">
				The <Code>borderColor</Code> is consumed by <Code>{'<Avatar/>'}</Code> and passed on to{' '}
				<Code>{'<Presence/>'}</Code>
				and <Code>{'<Status/>'}</Code>
			</Text>
			<Text as="p">
				Make sure the focus indicator has at least 3:1 color contrast with the background color.
			</Text>
			<Text as="p">
				Try clicking/tabbing on the avatars to see how the focus ring interacts with the background
				color.
			</Text>
		</Text>

		<Grid gap="space.025" alignItems="center">
			<Grid testId="grid-basic" gap="space.0" xcss={styles.grid}>
				{exampleColors.map((color: string, index: number) => (
					<ColorColumn
						key={index}
						borderColor={color}
						src={avatarUrl}
						presence={presences[index]}
					/>
				))}
			</Grid>

			<Grid testId="grid-basic" gap="space.0" xcss={styles.grid}>
				{exampleColors.map((color: string, index: number) => (
					<ColorColumn
						key={index}
						borderColor={color}
						src={ExampleImg}
						appearance="square"
						status={statuses[index]}
					/>
				))}
			</Grid>

			<Grid testId="grid-basic" gap="space.0" xcss={styles.grid}>
				{exampleColors.map((color: string, index: number) => (
					<ColorColumn
						key={index}
						borderColor={color}
						src={loomCircleImage}
						appearance="hexagon"
						status={statuses[index]}
					/>
				))}
			</Grid>
		</Grid>

		{fg('avatar-custom-border') && (
			<React.Fragment>
				<Heading as="h2" size="large">
					Custom Borders
				</Heading>

				<Text size="large" color="color.text.subtlest">
					<Text as="p">
						For borders beyond a single colour (e.g. gradients, patterns, or images), wrap the
						Avatar in a container with the desired <Code>background</Code> and set{' '}
						<Code>{'borderColor="transparent"'}</Code> to remove the default border.
					</Text>
				</Text>

				<Grid testId="grid-gradient" gap="space.200" xcss={styles.grid} alignItems="center">
					{gradientBorders.map((gradient, index) => (
						<Stack key={index} alignBlock="center" alignInline="center" space="space.200">
							<div css={styles.gradientCircle} style={{ background: gradient }}>
								<Avatar
									src={ExampleImg}
									borderColor="transparent"
									size="xlarge"
									name="Gradient border circle"
								/>
							</div>
							<div css={styles.gradientSquare} style={{ background: gradient }}>
								<Avatar
									src={ExampleImg}
									borderColor="transparent"
									appearance="square"
									size="xlarge"
									name="Gradient border square"
								/>
							</div>
						</Stack>
					))}
				</Grid>
			</React.Fragment>
		)}
	</Stack>
);
export default _default;
