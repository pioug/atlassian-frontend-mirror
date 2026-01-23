import React from 'react';

import Heading from '@atlaskit/heading';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, Inline, Stack, xcss } from '@atlaskit/primitives';

import AppIcon from '../core/app';
import ChevronDownIcon from '../core/chevron-down';

const iconContainerStyles = xcss({
	border: '1px dashed',
	borderRadius: 'radius.small',
	lineHeight: '0',
	borderColor: 'color.border.accent.magenta',
});
const IconContainer = ({ children }: { children: React.ReactChild }) => (
	// renders children with a surrounding box to show the icon size
	<Box xcss={iconContainerStyles}>{children}</Box>
);

const styles = xcss({ padding: 'space.200' });
const IconSizeExample = (): React.JSX.Element => {
	return (
		<Stack space="space.200" alignInline="start" xcss={styles}>
			<Heading size="small">Icon spacing, and fallbacks</Heading>

			<Inline space="space.100">
				<IconContainer>
					<ChevronDownIcon label="" size="small" />
				</IconContainer>
				<IconContainer>
					<ChevronDownIcon label="" spacing="compact" size="small" />
				</IconContainer>
				<IconContainer>
					<ChevronDownIcon label="" spacing="spacious" size="small" />
				</IconContainer>
				<IconContainer>
					<AppIcon label="" spacing="none" />
				</IconContainer>
				<IconContainer>
					<AppIcon label="" spacing="compact" />
				</IconContainer>
				<IconContainer>
					<AppIcon label="" spacing="spacious" />
				</IconContainer>
				New icons
			</Inline>

			<Inline space="space.100">
				<IconContainer>
					<ChevronDownIcon label="" size="small" />
				</IconContainer>
				<IconContainer>
					<AppIcon label="" spacing="none" />
				</IconContainer>
				<IconContainer>
					<AppIcon label="" spacing="spacious" />
				</IconContainer>
				New icons with legacy fallback (feature flagged)
			</Inline>
		</Stack>
	);
};

export default IconSizeExample;
