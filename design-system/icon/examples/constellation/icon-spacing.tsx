import React from 'react';

import Heading from '@atlaskit/heading';
import AddIcon from '@atlaskit/icon/core/add';
import ChevronIcon from '@atlaskit/icon/utility/chevron-down';
import { Box, Inline, Stack, xcss } from '@atlaskit/primitives';

const IconUtilityExample = () => {
	return (
		<Stack space="space.100">
			<Heading size="small">Core Icon:</Heading>
			<Inline space="space.100">
				<IconContainer>
					<AddIcon label="" />
				</IconContainer>
				<IconContainer>
					<AddIcon label="" spacing="spacious" />
				</IconContainer>
			</Inline>
			<Heading size="small">Utility icon:</Heading>
			<Inline space="space.100">
				<IconContainer>
					<ChevronIcon label="" />
				</IconContainer>
				<IconContainer>
					<ChevronIcon label="" spacing="compact" />
				</IconContainer>
				<IconContainer>
					<ChevronIcon label="" spacing="spacious" />
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

export default IconUtilityExample;
