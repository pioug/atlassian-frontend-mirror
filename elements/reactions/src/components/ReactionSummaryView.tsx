/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useCallback, useState } from 'react';

import { type Placement } from '@atlaskit/popper';
import Popup from '@atlaskit/popup';

import {
	type ReactionClick,
	type ReactionFocused,
	type ReactionMouseEnter,
	type ReactionSource,
} from '../types';
import { Reaction } from './Reaction';
import { type ReactionsProps, type OpenReactionsDialogOptions } from './Reactions';
import { type TriggerProps } from './Trigger';
import { ReactionSummaryViewEmojiPicker } from './ReactionSummaryViewEmojiPicker';
import { ReactionSummaryButton } from './ReactionSummaryButton';

import { Inline } from '@atlaskit/primitives/compiled';
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
	handleOpenReactionsDialog?: (options?: OpenReactionsDialogOptions) => void /**
	 * Optional prop for controlling if the reactions component is view only, disabling adding reactions
	 */;
	isViewOnly?: boolean;
	/**
	 * Optional event handler when the emoji picker is opened
	 */
	onOpen?: () => void;
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
					xcss={styles.summaryPopup}
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
							allowUserDialog={allowUserDialog}
							handleOpenReactionsDialog={handleOpenReactionsDialog}
							isViewOnly={isViewOnly}
						/>
					))}
					{allowSelectFromSummaryView && (
						<ReactionSummaryViewEmojiPicker
							emojiProvider={emojiProvider}
							disabled={disabled}
							onSelection={onSelection}
							emojiPickerSize={emojiPickerSize}
							tooltipContent={tooltipContent}
							reactionPickerTriggerIcon={reactionPickerTriggerIcon}
							onOpen={onOpen}
						/>
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
					useCompactStyles={allowSelectFromSummaryView}
					useButtonAlignmentStyling={useButtonAlignmentStyling}
				/>
			)}
		/>
	);
};
