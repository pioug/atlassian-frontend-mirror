import React from 'react';

import Heading from '@atlaskit/heading';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, Inline, Stack, xcss } from '@atlaskit/primitives';

import AppIcon from '../core/app';

const iconContainerStyles = xcss({
	borderStyle: 'dashed',
	borderWidth: 'border.width',
	borderRadius: 'radius.small',
	lineHeight: '0',
	borderColor: 'color.border.accent.magenta',
});
const IconContainer = ({ children }: { children: React.ReactChild }) => (
	// renders children with a surrounding box to show the icon size
	<Box xcss={iconContainerStyles}>{children}</Box>
);

const styles = xcss({ padding: 'space.200' });
const IconSizeExample = () => {
	return (
		<Stack space="space.200" alignInline="start" xcss={styles}>
			<Heading size="small">Core Icon sizing</Heading>

			<Inline space="space.100">
				<IconContainer>
					<AppIcon label="" size="small" />
				</IconContainer>
				<IconContainer>
					<AppIcon label="" />
				</IconContainer>
				New icons
			</Inline>
		</Stack>
	);
};

export default IconSizeExample;
