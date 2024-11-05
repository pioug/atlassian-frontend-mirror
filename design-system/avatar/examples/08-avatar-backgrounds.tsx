import React from 'react';

import Avatar, { type AppearanceType, type PresenceType, type StatusType } from '@atlaskit/avatar';
import Heading from '@atlaskit/heading';
import { Box, Grid, Stack, xcss } from '@atlaskit/primitives';
import { N0, N20 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { avatarUrl } from '../examples-util/data';
import { Code, Note } from '../examples-util/helpers';

const exampleColors = [
	token('color.background.neutral', N20),
	token('color.background.input.pressed', N0),
];

const presences: PresenceType[] = ['focus', 'online', 'offline', 'busy'];
const statuses: StatusType[] = ['approved', 'locked', 'declined'];

const columnStyles = xcss({
	display: 'flex',
	flex: 1,
	flexDirection: 'column',
	paddingBlockEnd: 'space.100',
	paddingInlineStart: 'space.200',
	paddingInlineEnd: 'space.200',
	paddingBlockStart: 'space.100',
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
		<Stack alignBlock="center" alignInline="center" space="space.500" xcss={columnStyles}>
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

export default () => (
	<Box>
		<Heading as="h2" size="large">
			Coloured Backgrounds
		</Heading>
		<Note>
			<Box as="p">
				The <Code>borderColor</Code> is consumed by <Code>{'<Avatar/>'}</Code> and passed on to{' '}
				<Code>{'<Presence/>'}</Code>
				and <Code>{'<Status/>'}</Code>
			</Box>
			<Box as="p">
				Make sure the focus indicator has at least 3:1 color contrast with the background color.
			</Box>
			<Box as="p">
				Try clicking/tabbing on the avatars to see how the focus ring interacts with the background
				color.
			</Box>
		</Note>
		<Grid gap="space.025" alignItems="center">
			<Grid templateColumns="1fr 1fr" testId="grid-basic" gap="space.0">
				{exampleColors.map((color: string, index: number) => (
					<ColorColumn
						key={index}
						borderColor={color}
						src={avatarUrl}
						presence={presences[index]}
					/>
				))}
			</Grid>

			<Grid templateColumns="1fr 1fr" testId="grid-basic" gap="space.0">
				{exampleColors.map((color: string, index: number) => (
					<ColorColumn
						key={index}
						borderColor={color}
						src={avatarUrl}
						appearance="square"
						status={statuses[index]}
					/>
				))}
			</Grid>
		</Grid>
	</Box>
);
