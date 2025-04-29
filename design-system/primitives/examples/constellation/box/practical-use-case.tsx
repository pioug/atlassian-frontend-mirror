import React from 'react';

import Avatar from '@atlaskit/avatar';
import Heading from '@atlaskit/heading';
import PullRequestIcon from '@atlaskit/icon/core/migration/pull-request--bitbucket-pullrequests';
import ShowMoreHorizontalIcon from '@atlaskit/icon/core/migration/show-more-horizontal--more';
import { AtlassianIcon } from '@atlaskit/logo';
import Lozenge from '@atlaskit/lozenge';
import { Box, Inline, Stack, Text, xcss } from '@atlaskit/primitives';

const containerStyles = xcss({
	display: 'flex',
	flexDirection: 'column',
	backgroundColor: 'elevation.surface.raised',
	padding: 'space.150',
	transition: '200ms',
	borderRadius: 'border.radius.100',
	boxShadow: 'elevation.shadow.raised',
	':hover': {
		backgroundColor: 'elevation.surface.hovered',
	},
});

const inlineStyles = xcss({
	display: 'flex',
	alignItems: 'center',
});

const extraInfoStyles = xcss({
	display: 'flex',
	justifyContent: 'space-between',
	paddingBlock: 'space.050',
});

export default function Example() {
	return (
		<Stack xcss={containerStyles} space="space.100">
			<Text as="span">
				Dropdown menu items in Modal are not accessible to keyboard/screen readers in Safari
			</Text>
			<Box as="span">
				<Lozenge appearance="new">Accelerate Cloud Accessibility</Lozenge>
			</Box>
			<Box xcss={extraInfoStyles}>
				<Box xcss={inlineStyles}>
					<AtlassianIcon appearance="brand" size="small" label="" />
					<Heading size="xxsmall">DSP-9786</Heading>
				</Box>
				<Inline space="space.100" alignBlock="center">
					<PullRequestIcon LEGACY_size="small" label="" />
					<ShowMoreHorizontalIcon LEGACY_size="small" label="" />
					<Avatar size="small" />
				</Inline>
			</Box>
		</Stack>
	);
}
