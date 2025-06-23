/**
 * @jsxRuntime classic
 * @jsx jsx
 */
/* elint-disable @atlaskit/design-system/no-deprecated-imports */
import React from 'react';

import { cssMap, jsx } from '@compiled/react';

import Heading from '@atlaskit/heading';
import AddIcon from '@atlaskit/icon/core/add';
import ChevronIcon from '@atlaskit/icon/core/chevron-down';
import ChevronDownIcon from '@atlaskit/icon/core/chevron-down';
import Lozenge from '@atlaskit/lozenge';
import { Inline, Stack } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

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
					<ChevronDownIcon label="" />
				</IconContainer>
				<IconContainer>
					<ChevronDownIcon label="" spacing="compact" />
				</IconContainer>
				<IconContainer>
					<ChevronDownIcon label="" spacing="spacious" />
				</IconContainer>
			</Inline>
		</Stack>
	);
};

const iconContainerStyles = cssMap({
	root: {
		borderStyle: 'dashed',
		borderRadius: token('border.radius.100'),
		borderColor: token('color.border.accent.magenta'),
		lineHeight: 0,
		borderWidth: '1px',
	},
});
const IconContainer = ({ children }: { children: React.ReactChild }) => (
	// renders children with a surrounding box to show the icon size
	<div css={iconContainerStyles.root}>{children}</div>
);

export default IconSpacingExample;
