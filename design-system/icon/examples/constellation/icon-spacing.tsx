import React from 'react';

import Heading from '@atlaskit/heading';
import AddIcon from '@atlaskit/icon/core/add';
import ChevronIcon from '@atlaskit/icon/core/chevron-down';
import ChevronIconUtility from '@atlaskit/icon/utility/chevron-down';
import Lozenge from '@atlaskit/lozenge';
import { Box, Inline, Stack, xcss } from '@atlaskit/primitives';

const IconSpacingExample = () => {
	return (
		<Stack space="space.100">
			<Heading size="small">Core icons (medium):</Heading>
			<Inline space="space.100">
				<IconContainer>
					<AddIcon label="" />
				</IconContainer>
				<IconContainer>
					<AddIcon label="" spacing="spacious" />
				</IconContainer>
			</Inline>
			<Heading size="small">Core icons (small):</Heading>
			<Inline space="space.100">
				<IconContainer>
					<ChevronIcon label="" size="small" />
				</IconContainer>
				<IconContainer>
					<ChevronIcon label="" size="small" spacing="compact" />
				</IconContainer>
				<IconContainer>
					<ChevronIcon label="" size="small" spacing="spacious" />
				</IconContainer>
			</Inline>
			<Heading size="small">
				Utility icons:{' '}
				<Lozenge appearance="moved" isBold>
					Deprecated
				</Lozenge>
			</Heading>
			<Inline space="space.100">
				<IconContainer>
					<ChevronIconUtility label="" />
				</IconContainer>
				<IconContainer>
					<ChevronIconUtility label="" spacing="compact" />
				</IconContainer>
				<IconContainer>
					<ChevronIconUtility label="" spacing="spacious" />
				</IconContainer>
			</Inline>
		</Stack>
	);
};

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

export default IconSpacingExample;
