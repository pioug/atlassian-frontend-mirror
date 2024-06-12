import React from 'react';

import AppIconOld from '../glyph/addon';
import HipchatChevronDownOld from '../glyph/hipchat/chevron-down';
import ChevronDownIcon from '../utility/chevron-down';
import AppIcon from '../core/app';

import { Box, Inline, Stack, xcss } from '@atlaskit/primitives';
import Heading from '@atlaskit/heading';

const iconContainerStyles = xcss({
	border: '1px dashed',
	borderRadius: 'border.radius.100',
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
			<Heading size="small">Icon spacing, and fallbacks</Heading>

			<Inline space="space.100">
				<IconContainer>
					<ChevronDownIcon label="" />
				</IconContainer>
				<IconContainer>
					<AppIcon label="" spacing="none" />
				</IconContainer>
				<IconContainer>
					<AppIcon label="" spacing="spacious" />
				</IconContainer>
				New icons
			</Inline>

			<Inline space="space.100">
				<IconContainer>
					<ChevronDownIcon
						label=""
						LEGACY_fallbackIcon={HipchatChevronDownOld}
						LEGACY_size="small"
					/>
				</IconContainer>
				<IconContainer>
					<AppIcon label="" spacing="none" LEGACY_size="small" LEGACY_fallbackIcon={AppIconOld} />
				</IconContainer>
				<IconContainer>
					<AppIcon label="" spacing="spacious" LEGACY_fallbackIcon={AppIconOld} />
				</IconContainer>
				New icons with legacy fallback (feature flagged)
			</Inline>
		</Stack>
	);
};

export default IconSizeExample;
