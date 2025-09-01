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
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography -- Ignored via go/DSP-18766
		lineHeight: '16px',
	},
});

const styles = cssMap({
	button: {
		color: token('color.text.subtle'),
		paddingTop: token('space.075'),
		paddingRight: token('space.150'),
		paddingBottom: token('space.075'),
		paddingLeft: token('space.150'),
		borderWidth: token('border.width'),
		borderStyle: 'solid',
		borderColor: token('color.border'),
		borderRadius: token('radius.small'),
		font: token('font.body'),
		fontWeight: token('font.weight.medium', '500'),
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
		flexShrink: 1,
		backgroundColor: token('color.background.neutral.subtle'),

		'&:hover': {
			backgroundColor: token('color.background.neutral.subtle.hovered'),
		},
		'&:active': {
			backgroundColor: token('color.background.neutral.subtle.pressed'),
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
				<Inline space="space.075" alignBlock="baseline">
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
