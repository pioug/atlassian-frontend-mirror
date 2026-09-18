import React from 'react';

import IconButton from '@atlaskit/button/icon/button';
import { cssMap, cx } from '@atlaskit/css';
import RetryIcon from '@atlaskit/icon/core/retry';
import { fg } from '@atlaskit/platform-feature-flags/fg';
import { Box, Inline, Pressable, Stack } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { AgentChatIcon } from '../../common/ui/agent-chat-icon';
import { BrowseAgentsPill } from '../../common/ui/chat-pill';
import type { ConversationStarter } from './index';

const styles = cssMap({
	conversationStartersList: {
		listStyle: 'none',
		padding: 0,
		width: '100%',
	},
	conversationStartersListWithRefreshDesign: {
		marginTop: token('space.0'),
	},
	conversationStaterItem: {
		paddingTop: token('space.0'),
	},
	conversationStarterIcon: {
		flexShrink: 0,
	},
	conversationStarterText: {
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
		flexShrink: 1,
		minWidth: '0px',
	},
	button: {
		color: token('color.text.subtle'),
		paddingTop: token('space.075'),
		paddingRight: token('space.075'),
		paddingBottom: token('space.075'),
		paddingLeft: token('space.075'),
		font: token('font.body'),
		fontWeight: token('font.weight.medium'),
		borderRadius: token('radius.small'),
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
		flexShrink: 1,
		width: '100%',
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
		paddingRight: token('space.075'),
		paddingBottom: token('space.075'),
		paddingLeft: token('space.075'),
		font: token('font.body'),
		fontWeight: token('font.weight.medium'),
		borderRadius: token('radius.small'),
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
		flexShrink: 1,
		width: '100%',
		backgroundColor: token('color.background.neutral.subtle'),
		transition: token('motion.button.hovered'),
		'&:hover': { backgroundColor: token('color.background.neutral.subtle.hovered') },
		'&:active': {
			backgroundColor: token('color.background.neutral.subtle.pressed'),
			transition: token('motion.button.pressed'),
		},
	},
});

export type ConversationStartersProps = {
	refreshDesignEnabled?: boolean;
	starters: ConversationStarter[];
	onConversationStarterClick: (conversationStarter: ConversationStarter) => void;
	showReloadButton?: boolean;
	onReloadButtonClick?: () => void;
	onBrowseAgentsClick?: () => void;
};

export const ConversationStarters = ({
	starters,
	onConversationStarterClick,
	showReloadButton = false,
	onReloadButtonClick = () => {},
	onBrowseAgentsClick,
	refreshDesignEnabled = false,
}: ConversationStartersProps): React.JSX.Element => {
	return (
		<Stack
			as="ul"
			space="space.050"
			xcss={cx(
				styles.conversationStartersList,
				refreshDesignEnabled && styles.conversationStartersListWithRefreshDesign,
			)}
		>
			{starters.map((starter, index) => {
				const isLastStarter = index === starters.length - 1;
				const chatPill = (
					<Box
						as="li"
						key={starter.message}
						xcss={refreshDesignEnabled && styles.conversationStaterItem}
					>
						<Pressable
							xcss={
								fg('platform-dst-motion-uplift-custom-button')
									? styles.button_motion
									: styles.button
							}
							onClick={() => onConversationStarterClick(starter)}
							testId="conversation-starter"
						>
							<Inline space="space.150" alignBlock="center">
								<Box xcss={styles.conversationStarterIcon}>
									<AgentChatIcon />
								</Box>
								<Box xcss={styles.conversationStarterText}>{starter.message}</Box>
							</Inline>
						</Pressable>
					</Box>
				);
				return isLastStarter && showReloadButton ? (
					<Inline space="space.050" grow="fill" alignInline="end" key={starter.message}>
						{chatPill}
						<IconButton
							icon={RetryIcon}
							onClick={onReloadButtonClick}
							appearance="subtle"
							label=""
						/>
					</Inline>
				) : (
					chatPill
				);
			})}
			{!!onBrowseAgentsClick && (
				<Box as="li">
					<BrowseAgentsPill onClick={onBrowseAgentsClick} />
				</Box>
			)}
		</Stack>
	);
};
