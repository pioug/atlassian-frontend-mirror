import React, { useCallback, useState } from 'react';
import { useIntl } from 'react-intl-next';

import { type Placement } from '@atlaskit/popper';
import Popup from '@atlaskit/popup';
import { Box, Inline, Pressable, Flex, xcss } from '@atlaskit/primitives';
import Button from '@atlaskit/button/new';
import Tooltip from '@atlaskit/tooltip';
import ShowMoreHorizontalIcon from '@atlaskit/icon/core/show-more-horizontal';

import { type ReactionClick, type ReactionFocused, type ReactionMouseEnter } from '../../types';
import { Reaction } from '../Reaction';
import { type ReactionsProps } from '../Reactions';

import { ReactionSummaryButton } from './ReactionSummaryButton';

import { messages } from '../../shared/i18n';

const summaryPopupStyles = xcss({
	padding: 'space.100',
	paddingTop: 'space.050',
	maxWidth: '325px',
});

const viewAllButtonStyling = xcss({
	marginTop: 'space.050',
});

const iconStyle = xcss({ height: '20px' });

/**
 * Test id for the Reactions summary view popup
 */
export const RENDER_SUMMARY_VIEW_POPUP_TESTID = 'render-summary-view-popup';

interface ReactionSummaryViewProps
	extends Pick<
		ReactionsProps,
		'emojiProvider' | 'reactions' | 'flash' | 'particleEffectByEmoji' | 'allowUserDialog'
	> {
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
	/**
	 * Optional prop for applying subtle styling to reaction picker
	 */
	subtleReactionsSummaryAndPicker?: boolean;
	/**
	 * Optional function when the user wants to see more users in a modal
	 */
	handleOpenReactionsDialog?: (emojiId: string) => void;
}

export const ReactionSummaryView = ({
	emojiProvider,
	reactions = [],
	flash = {},
	particleEffectByEmoji = {},
	placement = 'auto-start',
	onReactionClick,
	onReactionFocused,
	onReactionMouseEnter,
	showOpaqueBackground = false,
	subtleReactionsSummaryAndPicker = false,
	handleOpenReactionsDialog,
	allowUserDialog,
}: ReactionSummaryViewProps) => {
	const intl = useIntl();

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
					alignBlock="center"
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
							showParticleEffect={particleEffectByEmoji[reaction.emojiId]}
						/>
					))}
					{allowUserDialog && (
						<Box xcss={viewAllButtonStyling}>
							<Pressable backgroundColor="color.background.neutral.subtle" padding="space.0">
								<Tooltip content={intl.formatMessage(messages.seeWhoReactedTooltip)}>
									{(tooltipProps) => (
										<Button
											{...tooltipProps}
											spacing="compact"
											onClick={() => {
												handlePopupClose();
												handleOpenReactionsDialog?.(reactions[0].emojiId);
											}}
										>
											<Flex alignItems="center" xcss={iconStyle}>
												<ShowMoreHorizontalIcon
													label={intl.formatMessage(messages.seeWhoReacted)}
												/>
											</Flex>
										</Button>
									)}
								</Tooltip>
							</Pressable>
						</Box>
					)}
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
					subtleReactionsSummaryAndPicker={subtleReactionsSummaryAndPicker}
				/>
			)}
		/>
	);
};
