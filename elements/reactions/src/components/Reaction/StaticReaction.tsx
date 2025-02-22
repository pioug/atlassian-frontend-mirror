/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';
import { Box, xcss } from '@atlaskit/primitives';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

// please sync reaction styles that are not button-specific with ReactionButton.tsx
const staticReactionStyles = xcss({
	display: 'flex',
	flexDirection: 'row',
	alignItems: 'flex-start',
	minWidth: '36px',
	height: '24px',
	backgroundColor: 'color.background.neutral.subtle',
	color: 'color.text.subtle',
	marginBlockStart: 'space.050',
	marginInlineEnd: 'space.050',
	padding: 'space.0',
	overflow: 'hidden',
	border: 'none',
	':hover': {
		backgroundColor: 'color.background.neutral.subtle.hovered',
		cursor: 'default',
	},
});

type StaticReactionProps = {
	onMouseEnter?: (event: React.MouseEvent<HTMLButtonElement>) => void;
	onFocus?: (event: React.FocusEvent<HTMLButtonElement>) => void;
	testId?: string;
	children?: React.ReactNode;
	dataAttributes?: { [key: string]: string };
};

export const StaticReaction = ({
	onMouseEnter,
	onFocus,
	children,
	testId,
	dataAttributes = {},
}: StaticReactionProps) => {
	return (
		<Box
			onMouseEnter={onMouseEnter}
			onFocus={onFocus}
			testId={testId}
			xcss={staticReactionStyles}
			{...dataAttributes}
		>
			{children}
		</Box>
	);
};
