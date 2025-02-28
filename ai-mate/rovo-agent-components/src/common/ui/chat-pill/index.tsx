/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { forwardRef } from 'react';

import { cssMap as cssMapCompiled } from '@compiled/react';
import { useIntl } from 'react-intl-next';

import { type ButtonProps } from '@atlaskit/button';
import { cssMap, cx, jsx } from '@atlaskit/css';
import AgentIcon from '@atlaskit/icon/core/ai-agent';
import { Box, Inline, Pressable } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { ChatPillIcon } from '../chat-icon';

import messages from './messages';

const stylesCompiled = cssMapCompiled({
	pillLineHeight: {
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		lineHeight: '16px',
	},
});

const styles = cssMap({
	conversationStarterPill: {
		color: token('color.text'),
		paddingTop: token('space.100'),
		paddingRight: token('space.100'),
		paddingBottom: token('space.100'),
		paddingLeft: token('space.100'),
		borderWidth: token('border.width'),
		borderStyle: 'solid',
		borderColor: token('color.border'),
		borderRadius: token('border.radius.200'),
		borderBottomRightRadius: token('border.radius.050', '2px'),
		font: token('font.body'),
		fontWeight: token('font.weight.medium', '500'),
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
		flexShrink: 1,
		backgroundColor: 'transparent',
		width: '100%',

		'&:hover': {
			backgroundColor: token('color.background.neutral.hovered'),
		},

		'&:active': {
			backgroundColor: token('color.background.neutral.pressed'),
		},
	},

	button: {
		color: token('color.text'),
		paddingTop: token('space.100'),
		paddingRight: token('space.100'),
		paddingBottom: token('space.100'),
		paddingLeft: token('space.100'),
		borderRadius: token('border.radius.200'),
		borderBottomRightRadius: token('border.radius.050', '2px'),
		font: token('font.body'),
		fontWeight: token('font.weight.medium', '500'),
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
		flexShrink: 1,
		backgroundColor: token('color.background.neutral'),

		'&:hover': {
			backgroundColor: token('color.background.neutral.hovered'),
		},

		'&:active': {
			backgroundColor: token('color.background.neutral.pressed'),
		},
	},

	buttonInline: { paddingInline: token('space.025') },

	queryText: {
		wordBreak: 'break-word',
		textAlign: 'left',
	},

	whiteSpacePreWrap: {
		whiteSpace: 'pre-wrap',
	},
});

export type ChatPillProps = Omit<ButtonProps, 'iconBefore'> & {
	whiteSpacePreWrap?: boolean;
	renderIcon?: boolean;
};

export const ChatPill = forwardRef<HTMLButtonElement, ChatPillProps>(
	({ children, whiteSpacePreWrap = true, renderIcon = true, ...props }, ref) => (
		<Pressable ref={ref} {...props} xcss={styles.button}>
			<div css={stylesCompiled.pillLineHeight}>
				<Inline space="space.050" xcss={styles.buttonInline}>
					{renderIcon ? <ChatPillIcon /> : null}
					<Box xcss={cx(styles.queryText, whiteSpacePreWrap && styles.whiteSpacePreWrap)}>
						{children}
					</Box>
				</Inline>
			</div>
		</Pressable>
	),
);

export type BrowseAgentsPillProps = Omit<ButtonProps, 'iconBefore' | 'children'>;

export const BrowseAgentsPill = forwardRef<HTMLButtonElement, BrowseAgentsPillProps>(
	(props, ref) => {
		const { formatMessage } = useIntl();

		return (
			<Pressable ref={ref} {...props} xcss={styles.button}>
				<div css={stylesCompiled.pillLineHeight}>
					<Inline space="space.050" xcss={styles.buttonInline}>
						<AgentIcon color="currentColor" label="" />
						<Box xcss={styles.queryText}>{formatMessage(messages.browseAgentsPillLabel)}</Box>
					</Inline>
				</div>
			</Pressable>
		);
	},
);

export const ConversationStarterPill = forwardRef<HTMLButtonElement, ChatPillProps>(
	({ children, whiteSpacePreWrap = true, ...props }, ref) => (
		<Pressable ref={ref} {...props} xcss={styles.conversationStarterPill}>
			<div css={stylesCompiled.pillLineHeight}>
				<Inline space="space.050" xcss={styles.buttonInline}>
					<ChatPillIcon />
					<Box xcss={cx(styles.queryText, whiteSpacePreWrap && styles.whiteSpacePreWrap)}>
						{children}
					</Box>
				</Inline>
			</div>
		</Pressable>
	),
);
