/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useCallback, useState } from 'react';

import { type Placement } from '@atlaskit/popper';
import Popup from '@atlaskit/popup';
import { type OnEmojiEvent } from '@atlaskit/emoji/types';
import { EmojiPicker } from '@atlaskit/emoji/picker';
import { fg } from '@atlaskit/platform-feature-flags';

import {
	type ReactionClick,
	type ReactionFocused,
	type ReactionMouseEnter,
	type ReactionSource,
} from '../types';
import { useDelayedState } from '../hooks/useDelayedState';
import { Reaction } from './Reaction';
import { type ReactionsProps, type OpenReactionsDialogOptions } from './Reactions';
import { type TriggerProps } from './Trigger';
import { Trigger as EmojiPickerTrigger } from './Trigger';

import { ReactionSummaryButton } from './ReactionSummaryButton';
import { PickerRender } from '../ufo';

import { Box, Flex, Inline } from '@atlaskit/primitives/compiled';
import { cssMap, jsx } from '@compiled/react';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	summaryPopup: {
		paddingTop: token('space.050'),
		paddingRight: token('space.100'),
		paddingBottom: token('space.100'),
		paddingLeft: token('space.100'),
		maxWidth: '325px',
	},
});

/**
 * Test id for the Reactions summary view popup
 */
export const RENDER_SUMMARY_VIEW_POPUP_TESTID = 'render-summary-view-popup';

interface ReactionSummaryViewProps
	extends Pick<
			ReactionsProps,
			| 'emojiProvider'
			| 'reactions'
			| 'flash'
			| 'particleEffectByEmoji'
			| 'allowUserDialog'
			| 'allowSelectFromSummaryView'
			| 'emojiPickerSize'
			| 'useButtonAlignmentStyling'
			| 'reactionPickerTriggerText'
		>,
		Pick<TriggerProps, 'tooltipContent' | 'reactionPickerTriggerIcon' | 'disabled'> {
	/**
	 * Optional prop to change the placement of the summary popup reaction list
	 */
	placement?: Placement;
	/**
	 * event handler when a a reaction button is clicked inside the summary
	 */
	onReactionClick: ReactionClick;
	/**
	 * Event callback when an emoji button is selected
	 * @param emojiId emoji unique id
	 * @param source source where the reaction was picked (either the initial default reactions or the custom reactions picker)
	 */
	onSelection: (emojiId: string, source: ReactionSource) => void;
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
	 * Optional prop for enabling the Reactions Dialog
	 */
	allowUserDialog?: boolean;
	/**
	 * Optional function when the user wants to open the Reactions Dialog
	 */
	handleOpenReactionsDialog?: (options?: OpenReactionsDialogOptions) => void;
	/**
	 * Optional prop for controlling if the reactions component is view only, disabling adding reactions
	 */
	isViewOnly?: boolean;
	/**
	 * Optional event handler when the emoji picker is opened
	 */
	onOpen?: () => void;
	/**
	 * Optional prop to make the summary view open on hover
	 */
	hoverableSummaryView?: boolean;
	/**
	 * Optional prop to set a delay for the summary view when it opens/closes on hover
	 */
	hoverableSummaryViewDelay?: number;
	/**
	 * Optional prop for the optimistic image URL
	 */
	summaryGetOptimisticImageURL?: (emojiId: string) => string;
	/**
	 * Optional prop to control if the side picker is shown
	 */
	summaryButtonIconAfter?: React.ReactNode;
	/**
	 * Optional prop to set the most recently clicked id
	 */
	summaryViewParticleEffectEmojiId?: { id: string; shortName: string } | null;
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
	allowUserDialog,
	handleOpenReactionsDialog,
	isViewOnly = false,
	allowSelectFromSummaryView,
	disabled,
	emojiPickerSize,
	onSelection,
	tooltipContent,
	reactionPickerTriggerIcon,
	onOpen,
	useButtonAlignmentStyling,
	reactionPickerTriggerText,
	hoverableSummaryView = false,
	hoverableSummaryViewDelay = 300,
	summaryGetOptimisticImageURL,
	summaryButtonIconAfter,
	summaryViewParticleEffectEmojiId,
}: ReactionSummaryViewProps) => {
	const [isSummaryPopupOpen, setSummaryPopupOpen] = useDelayedState<boolean>(
		false,
		hoverableSummaryViewDelay,
	);
	const [isHoveringSummaryView, setIsHoveringSummaryView] = useState<boolean>(false);
	const [isSummaryViewButtonHovered, setIsSummaryViewButtonHovered] = useState<boolean>(false);
	const [isSummaryViewButtonClicked, setIsSummaryViewButtonClicked] = useState<boolean>(false);
	const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState<boolean>(false);

	/**
	 * Event callback when the picker is closed
	 * @param _id Optional id if an emoji button was selected or undefined if was clicked outside the picker
	 */
	const close = useCallback((_id?: string) => {
		setIsEmojiPickerOpen(false);
		// ufo abort reaction experience
		PickerRender.abort({
			metadata: {
				emojiId: _id,
				source: 'ReactionPicker',
				reason: 'close dialog',
			},
		});
	}, []);

	/**
	 * Event callback when an emoji icon is selected
	 * @param item selected item
	 */
	const onEmojiSelected: OnEmojiEvent = useCallback(
		(item) => {
			// no emoji was selected
			if (!item.id) {
				return;
			}
			onSelection(item.id, 'emojiPicker');
			close(item.id);
		},
		[onSelection, close],
	);

	const handlePopupClose = useCallback(() => {
		setSummaryPopupOpen(false, true);
		setIsEmojiPickerOpen(false);
		setIsSummaryViewButtonClicked(false);
		setIsSummaryViewButtonHovered(false);
		setIsHoveringSummaryView(false);
	}, [
		setSummaryPopupOpen,
		setIsEmojiPickerOpen,
		setIsSummaryViewButtonClicked,
		setIsSummaryViewButtonHovered,
		setIsHoveringSummaryView,
	]);

	const openEmojiPicker = useCallback(() => {
		// ufo start reactions picker open experience
		PickerRender.start();
		onOpen && onOpen();
		// ufo reactions picker opened success
		setIsEmojiPickerOpen(true);
		PickerRender.success();
	}, [onOpen]);

	const handleEmojiPickerTriggerClick = useCallback(() => {
		openEmojiPicker();
		setSummaryPopupOpen(false, true);
		setIsSummaryViewButtonClicked(false);
		setIsSummaryViewButtonHovered(false);
		setIsHoveringSummaryView(false);
	}, [openEmojiPicker, setSummaryPopupOpen]);

	const handleSummaryClick = useCallback(() => {
		if (hoverableSummaryView) {
			setIsHoveringSummaryView(false);
			setIsSummaryViewButtonHovered(false);
			if (isEmojiPickerOpen || isSummaryViewButtonClicked) {
				// if either the emoji picker is open or the button was clicked, close the popup and reset the state
				setSummaryPopupOpen(false, true);
				setIsSummaryViewButtonClicked(false);
			} else {
				// if neither condition is true, open the popup and set the state
				setSummaryPopupOpen(true, true);
				setIsSummaryViewButtonClicked(true);
			}
			// close the emoji picker
			setIsEmojiPickerOpen(false);
		} else {
			if (isSummaryPopupOpen) {
				handlePopupClose();
			} else {
				setSummaryPopupOpen(true);
			}
		}
	}, [
		hoverableSummaryView,
		isEmojiPickerOpen,
		setSummaryPopupOpen,
		isSummaryPopupOpen,
		handlePopupClose,
		isSummaryViewButtonClicked,
		setIsSummaryViewButtonClicked,
	]);

	const handleButtonMouseEnter = useCallback(() => {
		setIsSummaryViewButtonHovered(true);
		if (hoverableSummaryView && !isEmojiPickerOpen) {
			setSummaryPopupOpen(true);
		}
	}, [hoverableSummaryView, setSummaryPopupOpen, setIsSummaryViewButtonHovered, isEmojiPickerOpen]);

	const handleButtonMouseLeave = useCallback(() => {
		setIsSummaryViewButtonHovered(false);
		if (hoverableSummaryView && !isHoveringSummaryView && !isSummaryViewButtonClicked) {
			setSummaryPopupOpen(false);
		}
	}, [
		hoverableSummaryView,
		isHoveringSummaryView,
		setSummaryPopupOpen,
		setIsSummaryViewButtonHovered,
		isSummaryViewButtonClicked,
	]);

	const handleSummaryViewTrayMouseEnter = useCallback(() => {
		setIsHoveringSummaryView(true);
		if (hoverableSummaryView && !isEmojiPickerOpen) {
			setSummaryPopupOpen(true);
		}
	}, [hoverableSummaryView, setSummaryPopupOpen, setIsHoveringSummaryView, isEmojiPickerOpen]);

	const handleSummaryViewTrayMouseLeave = useCallback(() => {
		setIsHoveringSummaryView(false);
		if (hoverableSummaryView && !isSummaryViewButtonHovered && !isSummaryViewButtonClicked) {
			setSummaryPopupOpen(false);
		}
	}, [
		hoverableSummaryView,
		isSummaryViewButtonHovered,
		setIsHoveringSummaryView,
		setSummaryPopupOpen,
		isSummaryViewButtonClicked,
	]);

	return (
		<Popup
			placement={placement}
			content={({ update: recalculatePopupPosition }) =>
				isEmojiPickerOpen ? (
					<EmojiPicker
						emojiProvider={emojiProvider}
						onSelection={onEmojiSelected}
						size={emojiPickerSize}
					/>
				) : (
					<Box
						testId={RENDER_SUMMARY_VIEW_POPUP_TESTID}
						onMouseEnter={handleSummaryViewTrayMouseEnter}
						onMouseLeave={handleSummaryViewTrayMouseLeave}
					>
						{allowSelectFromSummaryView && (
							<Flex justifyContent="center" testId="reaction-summary-view-emoji-picker-container">
								<EmojiPickerTrigger
									disabled={disabled}
									reactionPickerTriggerIcon={reactionPickerTriggerIcon}
									tooltipContent={tooltipContent}
									onClick={() => {
										handleEmojiPickerTriggerClick();
										recalculatePopupPosition();
									}}
									showAddReactionText
									reactionPickerTriggerText={reactionPickerTriggerText}
									fullWidthSummaryViewReactionPickerTrigger
								/>
							</Flex>
						)}
						<Inline xcss={styles.summaryPopup} space="space.025" shouldWrap alignBlock="center">
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
									allowUserDialog={allowUserDialog}
									handleOpenReactionsDialog={handleOpenReactionsDialog}
									isViewOnly={isViewOnly}
								/>
							))}
						</Inline>
					</Box>
				)
			}
			isOpen={isSummaryPopupOpen || isEmojiPickerOpen}
			onClose={handlePopupClose}
			trigger={(triggerProps) => (
				<ReactionSummaryButton
					{...triggerProps}
					emojiProvider={emojiProvider}
					reactions={reactions}
					onClick={handleSummaryClick}
					onMouseEnter={handleButtonMouseEnter}
					onMouseLeave={handleButtonMouseLeave}
					showOpaqueBackground={showOpaqueBackground}
					subtleReactionsSummaryAndPicker={subtleReactionsSummaryAndPicker}
					useButtonAlignmentStyling={useButtonAlignmentStyling}
					summaryGetOptimisticImageURL={summaryGetOptimisticImageURL}
					summaryButtonIconAfter={summaryButtonIconAfter}
					summaryViewParticleEffectEmojiId={summaryViewParticleEffectEmojiId}
				/>
			)}
			shouldRenderToParent={fg('should-render-to-parent-should-be-true-editor-coll')}
		/>
	);
};
