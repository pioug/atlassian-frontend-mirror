/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { forwardRef, type ForwardRefExoticComponent, type RefAttributes } from 'react';

import { cssMap as cssMapCompiled } from '@compiled/react';
import { useIntl } from 'react-intl';

import type { ButtonProps } from '@atlaskit/button/button';
import { cssMap, cx, jsx } from '@atlaskit/css';
import AgentIcon from '@atlaskit/icon/core/ai-agent';
import { fg } from '@atlaskit/platform-feature-flags/fg';
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
		fontWeight: token('font.weight.medium'),
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
		flexShrink: 1,
		backgroundColor: token('color.background.neutral.subtle'),

		'&:hover': {
			backgroundColor: token('color.background.neutral.subtle.hovered'),
		},
		'&:active': {
			backgroundColor: token('color.background.neutral.subtle.pressed'),
			transition: token('motion.button.pressed'),
		},
		transition: token('motion.button.hovered'),
	},
	button_motion: {
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
		fontWeight: token('font.weight.medium'),
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
		flexShrink: 1,
		backgroundColor: token('color.background.neutral.subtle'),
		transition: token('motion.button.hovered'),
		'&:hover': { backgroundColor: token('color.background.neutral.subtle.hovered') },
		'&:active': {
			backgroundColor: token('color.background.neutral.subtle.pressed'),
			transition: token('motion.button.pressed'),
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

export const ChatPill: ForwardRefExoticComponent<
	Omit<ButtonProps, 'iconBefore'> & {
		whiteSpacePreWrap?: boolean;
		renderIcon?: boolean;
	} & RefAttributes<HTMLButtonElement>
> = forwardRef<HTMLButtonElement, ChatPillProps>(
	({ children, whiteSpacePreWrap = true, renderIcon = true, ...props }, ref) => (
		<Pressable
			ref={ref}
			{...props}
			xcss={fg('platform-dst-motion-uplift-custom-button') ? styles.button_motion : styles.button}
		>
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

export const BrowseAgentsPill: ForwardRefExoticComponent<
	BrowseAgentsPillProps & RefAttributes<HTMLButtonElement>
> = forwardRef<HTMLButtonElement, BrowseAgentsPillProps>((props, ref) => {
	const { formatMessage } = useIntl();

	return (
		<Pressable
			ref={ref}
			{...props}
			xcss={fg('platform-dst-motion-uplift-custom-button') ? styles.button_motion : styles.button}
		>
			<div css={stylesCompiled.pillLineHeight}>
				<Inline space="space.050" xcss={styles.buttonInline}>
					<AgentIcon color="currentColor" label="" />
					<Box xcss={styles.queryText}>{formatMessage(messages.browseAgentsPillLabel)}</Box>
				</Inline>
			</div>
		</Pressable>
	);
});
