import { type Placement } from '@atlaskit/popper';
import Popup from '@atlaskit/popup';
import { Inline, xcss } from '@atlaskit/primitives';
import React, { useCallback, useState } from 'react';

import { type ReactionClick, type ReactionFocused, type ReactionMouseEnter } from '../../types';
import { Reaction, type ReactionProps } from '../Reaction';
import { type ReactionsProps } from '../Reactions';
import { ReactionSummaryButton } from './ReactionSummaryButton';

const summaryPopupStyles = xcss({
	padding: 'space.100',
	paddingTop: 'space.050',
	maxWidth: '325px',
});

/**
 * Test id for the Reactions summary view popup
 */
export const RENDER_SUMMARY_VIEW_POPUP_TESTID = 'render-summary-view-popup';

interface ReactionSummaryViewProps
	extends Pick<ReactionsProps, 'emojiProvider' | 'reactions' | 'flash' | 'particleEffectByEmoji'>,
		Pick<ReactionProps, 'allowUserDialog'> {
	/**
	 * Optional function when the user wants to see more users in a modal
	 */
	handleOpenReactionsDialog: (emojiId: string) => void;

	/**
	 * Optional prop to change the placement of the summary popup reaction list
	 */
	placement?: Placement;
	/**
	 * event handler when a a reaction button is clicked inside the summary
	 */
	onReactionClick: ReactionClick;
	/**
	 * Optional event when the mouse cursor hovers over a reaction button inside the summary
	 */
	onReactionMouseEnter?: ReactionMouseEnter;
	/**
	 * Optional event when focused a reaction inside the summary
	 */
	onReactionFocused?: ReactionFocused;
	/**
	 * Optional prop for using an opaque button background instead of a transparent background
	 */
	showOpaqueBackground?: boolean;
}

export const ReactionSummaryView = ({
	emojiProvider,
	reactions = [],
	flash = {},
	particleEffectByEmoji = {},
	handleOpenReactionsDialog,
	allowUserDialog,
	placement = 'auto-start',
	onReactionClick,
	onReactionFocused,
	onReactionMouseEnter,
	showOpaqueBackground = false,
}: ReactionSummaryViewProps) => {
	const [isSummaryPopupOpen, setSummaryPopupOpen] = useState<boolean>(false);

	const handlePopupClose = useCallback(() => setSummaryPopupOpen(false), []);
	const handleSummaryClick = useCallback(
		() => setSummaryPopupOpen(!isSummaryPopupOpen),
		[isSummaryPopupOpen],
	);

	return (
		<Popup
			placement={placement}
			content={() => (
				<Inline
					xcss={summaryPopupStyles}
					testId={RENDER_SUMMARY_VIEW_POPUP_TESTID}
					space="space.025"
					shouldWrap
				>
					{reactions.map((reaction) => (
						<Reaction
							key={reaction.emojiId}
							reaction={reaction}
							emojiProvider={emojiProvider}
							onClick={onReactionClick}
							onFocused={onReactionFocused}
							onMouseEnter={onReactionMouseEnter}
							flash={flash[reaction.emojiId]}
							handleUserListClick={handleOpenReactionsDialog}
							allowUserDialog={allowUserDialog}
							showParticleEffect={particleEffectByEmoji[reaction.emojiId]}
						/>
					))}
				</Inline>
			)}
			isOpen={isSummaryPopupOpen}
			onClose={handlePopupClose}
			trigger={(triggerProps) => (
				<ReactionSummaryButton
					{...triggerProps}
					emojiProvider={emojiProvider}
					reactions={reactions}
					onClick={handleSummaryClick}
					showOpaqueBackground={showOpaqueBackground}
				/>
			)}
		/>
	);
};
