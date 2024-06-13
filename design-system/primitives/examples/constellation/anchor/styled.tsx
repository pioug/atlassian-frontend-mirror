import React from 'react';

import Heading from '@atlaskit/heading';
import { type IconProps } from '@atlaskit/icon';
import Blog24Icon from '@atlaskit/icon-object/glyph/blog/24';
import Improvement24Icon from '@atlaskit/icon-object/glyph/improvement/24';
import Page24Icon from '@atlaskit/icon-object/glyph/page/24';
import { Anchor, Box, Grid, Inline, Stack, Text, xcss } from '@atlaskit/primitives';
import { media } from '@atlaskit/primitives/responsive';

const anchorStyles = xcss({
	color: 'color.text',
	backgroundColor: 'elevation.surface',
	padding: 'space.200',
	textDecoration: 'none',
	borderColor: 'color.border',
	borderStyle: 'solid',
	borderWidth: 'border.width',
	borderRadius: 'border.radius',

	':hover': {
		backgroundColor: 'elevation.surface.hovered',
		textDecoration: 'none',
	},
	':active': {
		backgroundColor: 'elevation.surface.pressed',
	},
});

const iconContainerStyles = xcss({
	width: '24px',
	display: 'flex',
});

const gridStyles = xcss({
	[media.above.sm]: {
		gridTemplateColumns: '1fr 1fr',
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
		<Anchor href={href} xcss={anchorStyles}>
			<Stack space="space.100">
				<Inline space="space.150" alignBlock="center">
					<Box xcss={iconContainerStyles}>
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

export default function Styled() {
	return (
		<Stack space="space.200">
			<Heading as="h2" size="small">
				Pick up where you left off
			</Heading>
			<Grid rowGap="space.100" columnGap="space.100" templateColumns="1fr" xcss={gridStyles}>
				<PageLink
					href="/components/primitives/overview"
					icon={Blog24Icon}
					title="Anchor primitive is now in beta!"
					space="Design System Team"
					lastVisited="1 hour ago"
				/>
				<PageLink
					href="/components/primitives/overview"
					icon={Page24Icon}
					title="Impact & release planning"
					space="Design System Team"
					lastVisited="1 day ago"
				/>
				<PageLink
					href="/components/primitives/overview"
					icon={Page24Icon}
					title="How to implement dark mode"
					space="Design System Team"
					lastVisited="12 May 2024"
				/>
				<PageLink
					href="/components/primitives/overview"
					icon={Improvement24Icon}
					title="New Bitbucket pull requests"
					space="Bitbucket Cloud"
					lastVisited="10 May 2024"
				/>
			</Grid>
		</Stack>
	);
}
