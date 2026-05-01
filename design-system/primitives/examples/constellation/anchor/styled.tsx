import React from 'react';

import { cssMap } from '@atlaskit/css';
import Heading from '@atlaskit/heading';
import { type IconProps } from '@atlaskit/icon';
import BlogObjectTile from '@atlaskit/object/tile/blog';
import ImprovementObjectTile from '@atlaskit/object/tile/improvement';
import PageObjectTile from '@atlaskit/object/tile/page';
import { Anchor, Box, Grid, Inline, Stack, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const BlogIcon = () => <BlogObjectTile size="small" />;
const PageIcon = () => <PageObjectTile size="small" label="" />;
const ImprovementIcon = () => <ImprovementObjectTile size="small" label="" />;

const styles = cssMap({
	anchor: {
		color: token('color.text'),
		backgroundColor: token('elevation.surface'),
		paddingBlockStart: token('space.200'),
		paddingInlineEnd: token('space.200'),
		paddingBlockEnd: token('space.200'),
		paddingInlineStart: token('space.200'),
		textDecoration: 'none',
		borderColor: token('color.border'),
		borderStyle: 'solid',
		borderWidth: token('border.width'),
		borderRadius: token('radius.small'),

		'&:hover': {
			backgroundColor: token('elevation.surface.hovered'),
			textDecoration: 'none',
		},
		'&:active': {
			backgroundColor: token('elevation.surface.pressed'),
		},
	},
	iconContainer: {
		width: '24px',
		display: 'flex',
	},
	grid: {
		'@media (min-width: 48rem)': {
			gridTemplateColumns: '1fr 1fr',
		},
		rowGap: token('space.100'),
		columnGap: token('space.100'),
		gridTemplateColumns: '1fr',
	},
});

type PageLinkProps = {
	href: string;
	title: string;
	space: string;
	lastVisited: string;
	icon: React.ComponentType<IconProps>;
};

const PageLink = ({ href, title, space, lastVisited, icon: Icon }: PageLinkProps) => {
	return (
		<Anchor href={href} xcss={styles.anchor}>
			<Stack space="space.100">
				<Inline space="space.150" alignBlock="center">
					<Box xcss={styles.iconContainer}>
						<Icon label="" />
					</Box>
					<Stack>
						<Heading as="h3" size="small">
							{title}
						</Heading>
						<Text color="color.text.subtle" size="small">
							{space}
						</Text>
					</Stack>
				</Inline>
				<Text color="color.text.subtle" size="small">
					Visited {lastVisited}
				</Text>
			</Stack>
		</Anchor>
	);
};

export default function Styled(): React.JSX.Element {
	return (
		<Stack space="space.200">
			<Heading as="h2" size="small">
				Pick up where you left off
			</Heading>
			<Grid xcss={styles.grid}>
				<PageLink
					href="/components/primitives/overview"
					icon={BlogIcon}
					title="Anchor primitive is now in beta!"
					space="Design System Team"
					lastVisited="1 hour ago"
				/>
				<PageLink
					href="/components/primitives/overview"
					icon={PageIcon}
					title="Impact & release planning"
					space="Design System Team"
					lastVisited="1 day ago"
				/>
				<PageLink
					href="/components/primitives/overview"
					icon={PageIcon}
					title="How to implement dark mode"
					space="Design System Team"
					lastVisited="12 May 2024"
				/>
				<PageLink
					href="/components/primitives/overview"
					icon={ImprovementIcon}
					title="New Bitbucket pull requests"
					space="Bitbucket Cloud"
					lastVisited="10 May 2024"
				/>
			</Grid>
		</Stack>
	);
}
