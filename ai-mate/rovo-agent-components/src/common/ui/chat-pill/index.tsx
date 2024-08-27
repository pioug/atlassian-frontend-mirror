import React from 'react';

import { type ButtonProps } from '@atlaskit/button';
import { Box, Inline, Pressable, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

import { ChatPillIcon } from '../chat-icon';

const buttonStyles = xcss({
	color: 'color.text',
	padding: 'space.100',
	borderRadius: 'border.radius.200',
	borderBottomRightRadius: token('border.radius.050', '2px'),
	font: token('font.body'),
	fontWeight: token('font.weight.medium', '500'),
	lineHeight: '16px',
	textOverflow: 'ellipsis',
	whiteSpace: 'nowrap',
	flexShrink: 1,
	backgroundColor: 'color.background.neutral',

	':hover': {
		backgroundColor: 'color.background.neutral.hovered',
	},

	':active': {
		backgroundColor: 'color.background.neutral.pressed',
	},
});

const buttonInlineStyles = xcss({ paddingInline: 'space.025' });

const queryTextStyles = xcss({
	wordBreak: 'break-word',
	textAlign: 'left',
});

const whiteSpacePreWrapStyles = xcss({
	whiteSpace: 'pre-wrap',
});

export type ChatPillProps = Omit<ButtonProps, 'iconBefore'> & {
	whiteSpacePreWrap?: boolean;
};

export const ChatPill = React.forwardRef<HTMLButtonElement, ChatPillProps>(
	({ children, whiteSpacePreWrap = true, ...props }, ref) => (
		<Pressable ref={ref} {...props} xcss={buttonStyles}>
			<Inline space="space.050" xcss={buttonInlineStyles}>
				<ChatPillIcon />
				<Box xcss={[queryTextStyles, whiteSpacePreWrap && whiteSpacePreWrapStyles]}>{children}</Box>
			</Inline>
		</Pressable>
	),
);
