import React from 'react';

import { useIntl } from 'react-intl-next';

import { type ButtonProps } from '@atlaskit/button';
import AgentIcon from '@atlaskit/icon/core/ai-agent';
import { Box, Inline, Pressable, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

import { ChatPillIcon } from '../chat-icon';

import messages from './messages';

const conversationStarterPillStyles = xcss({
	color: 'color.text',
	padding: 'space.100',
	border: `1px solid ${token('color.border')}`,
	borderRadius: 'border.radius.200',
	borderBottomRightRadius: token('border.radius.050', '2px'),
	font: token('font.body'),
	fontWeight: token('font.weight.medium', '500'),
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
	lineHeight: '16px',
	textOverflow: 'ellipsis',
	whiteSpace: 'nowrap',
	flexShrink: 1,
	background: 'none',
	width: '100%',

	':hover': {
		backgroundColor: 'color.background.neutral.hovered',
	},

	':active': {
		backgroundColor: 'color.background.neutral.pressed',
	},
});

const buttonStyles = xcss({
	color: 'color.text',
	padding: 'space.100',
	borderRadius: 'border.radius.200',
	borderBottomRightRadius: token('border.radius.050', '2px'),
	font: token('font.body'),
	fontWeight: token('font.weight.medium', '500'),
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
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
	renderIcon?: boolean;
};

export const ChatPill = React.forwardRef<HTMLButtonElement, ChatPillProps>(
	({ children, whiteSpacePreWrap = true, renderIcon = true, ...props }, ref) => (
		<Pressable ref={ref} {...props} xcss={buttonStyles}>
			<Inline space="space.050" xcss={buttonInlineStyles}>
				{renderIcon ? <ChatPillIcon /> : null}
				<Box xcss={[queryTextStyles, whiteSpacePreWrap && whiteSpacePreWrapStyles]}>{children}</Box>
			</Inline>
		</Pressable>
	),
);

export type BrowseAgentsPillProps = Omit<ButtonProps, 'iconBefore' | 'children'>;

export const BrowseAgentsPill = React.forwardRef<HTMLButtonElement, BrowseAgentsPillProps>(
	(props, ref) => {
		const { formatMessage } = useIntl();

		return (
			<Pressable ref={ref} {...props} xcss={buttonStyles}>
				<Inline space="space.050" xcss={buttonInlineStyles}>
					<AgentIcon color="currentColor" label="" />
					<Box xcss={queryTextStyles}>{formatMessage(messages.browseAgentsPillLabel)}</Box>
				</Inline>
			</Pressable>
		);
	},
);

export const ConversationStarterPill = React.forwardRef<HTMLButtonElement, ChatPillProps>(
	({ children, whiteSpacePreWrap = true, ...props }, ref) => (
		<Pressable ref={ref} {...props} xcss={conversationStarterPillStyles}>
			<Inline space="space.050" xcss={buttonInlineStyles}>
				<ChatPillIcon />
				<Box xcss={[queryTextStyles, whiteSpacePreWrap && whiteSpacePreWrapStyles]}>{children}</Box>
			</Inline>
		</Pressable>
	),
);
