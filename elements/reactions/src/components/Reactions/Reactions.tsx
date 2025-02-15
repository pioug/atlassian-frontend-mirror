/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { FormattedMessage, useIntl } from 'react-intl-next';

import { type UIAnalyticsEvent, useAnalyticsEvents } from '@atlaskit/analytics-next';
import {
	type KeyboardOrMouseEvent,
	ModalTransition,
	type OnCloseHandler,
} from '@atlaskit/modal-dialog';
import Tooltip from '@atlaskit/tooltip';
import { type Placement } from '@atlaskit/popper';
import { Box, Pressable, Flex, xcss } from '@atlaskit/primitives';
import { fg } from '@atlaskit/platform-feature-flags';
import ShowMoreHorizontalIcon from '@atlaskit/icon/core/show-more-horizontal';
import Button from '@atlaskit/button/new';

import {
	createAndFireSafe,
	createPickerButtonClickedEvent,
	createPickerCancelledEvent,
	createPickerMoreClickedEvent,
	createReactionsRenderedEvent,
	createReactionSelectionEvent,
	isSampled,
} from '../../analytics';
import { SAMPLING_RATE_REACTIONS_RENDERED_EXP } from '../../shared/constants';
import { messages } from '../../shared/i18n';
import {
	ReactionStatus,
	type ReactionClick,
	type ReactionSummary,
	type ReactionSource,
	type QuickReactionEmojiSummary,
	type ProfileCardWrapper,
} from '../../types';
import {
	ReactionDialogClosed,
	ReactionDialogOpened,
	ReactionDialogSelectedReactionChanged,
	ReactionDialogPageNavigation,
} from '../../ufo';
import { Reaction } from '../Reaction';
import { ReactionsDialog } from '../ReactionDialog';
import { ReactionPicker, type ReactionPickerProps } from '../ReactionPicker';
import { type SelectorProps } from '../Selector';
import { ReactionSummaryView } from '../ReactionSummary/';

import { reactionPickerStyle, wrapperStyle } from './styles';

/**
 * Set of all available UFO experiences relating to Reactions Dialog
 */
export const ufoExperiences = {
	/**
	 * Experience when a reaction dialog is opened
	 */
	openDialog: ReactionDialogOpened,
	/**
	 * Experience when a reaction dialog is closed
	 */
	closeDialog: ReactionDialogClosed,
	/**
	 * Experience when a reaction changed/fetched from inside the modal dialog
	 */
	selectedReactionChangeInsideDialog: ReactionDialogSelectedReactionChanged,
	pageNavigated: ReactionDialogPageNavigation,
};

/**
 * Test id for wrapper Reactions div
 */
export const RENDER_REACTIONS_TESTID = 'render-reactions';
/**
 * Test id for the view all reacted user to trigger the dialog
 */
export const RENDER_VIEWALL_REACTED_USERS_DIALOG = 'viewall-reacted-users-dialog';

/**
 * Test id for summary view of reactions
 */
export const RENDER_REACTIONS_SUMMARY_TESTID = 'reaction-summary-view';

export interface ReactionsProps
	extends Pick<
			ReactionPickerProps,
			'allowAllEmojis' | 'emojiProvider' | 'emojiPickerSize' | 'miniMode'
		>,
		Pick<SelectorProps, 'pickerQuickReactionEmojiIds'> {
	/**
	 * event handler to fetching the reactions
	 */
	loadReaction: () => void;
	/**
	 * Event callback when an emoji button is selected
	 */
	onSelection: (emojiId: string) => void;
	/**
	 * Optional list of reactions to render (defaults to empty list)
	 */
	reactions?: ReactionSummary[];
	/**
	 * Condition for the reaction list status while being fetched
	 */
	status: ReactionStatus;
	/**
	 * event handler when the emoji button is clicked
	 */
	onReactionClick: ReactionClick;
	/**
	 * Optional emoji reactions list to show custom animation or render as standard (key => emoji string "id", value => true/false to show custom animation)
	 */
	flash?: Record<string, boolean>;
	/**
	 * Optional emoji reactions list to show floating emoji particle effect (key => emoji string "id", value => true/false to show the particle effect).
	 * Generally used for newly added reactions.
	 */
	particleEffectByEmoji?: Record<string, boolean>;
	/**
	 * Optional event to get reaction details for an emoji
	 * @param emojiId current reaction emoji id
	 */
	getReactionDetails?: (emojiId: string) => void;
	/**
	 * @private
	 * @deprecated use getReactionDetails instead
	 */
	onReactionHover?: (emojiId: string) => void;
	/**
	 * Optional error message to show when unable to display the reaction emoji
	 */
	errorMessage?: string;
	/**
	 * quickReactionEmojiIds are emojis that will be shown in the the primary view even if the reaction count is zero
	 */
	quickReactionEmojis?: QuickReactionEmojiSummary;
	/**
	 * Optional callback function called when opening reactions dialog
	 */
	onDialogOpenCallback?: (emojiId: string, source?: string) => void;
	/**
	 * Optional callback function called when closing reactions dialog
	 */
	onDialogCloseCallback?: OnCloseHandler;
	/**
	 * Optional callback function called when selecting a reaction in reactions dialog
	 */
	onDialogSelectReactionCallback?: (emojiId: string) => void;
	/**
	 * Optional callback function called when navigating between pages in the reactions dialog
	 */
	onDialogPageChangeCallback?: (emojiId: string, curentPage: number, maxPages: number) => void;
	/**
	 * Enables a summary view for displaying reactions. If enabled and the number of reactions meets or exceeds the summaryViewThreshold, reactions will be shown in a more aggregated format.
	 */
	summaryViewEnabled?: boolean;
	/**
	 * The minimum number of reactions required to switch to the summary view when summaryViewEnabled is true. Defaults to 3 if not specified.
	 */
	summaryViewThreshold?: number;
	/**
	 * Optional prop to change the placement of the summary popup reaction list
	 */
	summaryViewPlacement?: Placement;
	/**
	 * Optional prop for using an opaque button background instead of a transparent background
	 */
	showOpaqueBackground?: boolean;
	/**
	 * Optional prop for applying subtle styling to reaction summary and picker
	 */
	subtleReactionsSummaryAndPicker?: boolean;
	/**
	 * Optional prop for displaying text to add a reaction
	 */
	showAddReactionText?: boolean;
	/**
	 * Optional prop for hiding default reactions displayed when there are no existing reactions
	 */
	hideDefaultReactions?: boolean;
	/**
	 * Optional prop from checking a feature gate for rendering Reactions Dialog
	 */
	allowUserDialog?: boolean;
	/**
	 * Optional prop for rendering a profile card wrapper in the Reactions Dialog
	 */
	ProfileCardWrapper?: ProfileCardWrapper;
	/**
	 * Optional prop to hide the user reactions and only render the picker
	 */
	onlyRenderPicker?: boolean;
	/**
	 * Optional prop for controlling if the picker hover border will be rounded
	 */
	showRoundTrigger?: boolean;
}

/**
 * Get content of the tooltip
 */
export function getTooltip(status: ReactionStatus, errorMessage?: string) {
	switch (status) {
		case ReactionStatus.error:
			return errorMessage || <FormattedMessage {...messages.unexpectedError} />;
		// When reaction is not available don't show any tooltip (e.g. Archive page in Confluence)
		case ReactionStatus.disabled:
			return null;
		case ReactionStatus.notLoaded:
		case ReactionStatus.loading:
			return <FormattedMessage {...messages.loadingReactions} />;
		case ReactionStatus.ready:
			return <FormattedMessage {...messages.addReaction} />;
	}
}

const dialogEntrypointButtonStyle = xcss({
	marginRight: 'space.050',
	marginTop: 'space.050',
});

const iconStyle = xcss({ height: '20px' });

/**
 * Renders list of reactions
 */
export const Reactions = React.memo(
	({
		flash = {},
		particleEffectByEmoji = {},
		status,
		errorMessage,
		loadReaction,
		quickReactionEmojis,
		pickerQuickReactionEmojiIds,
		getReactionDetails = () => {},
		onReactionHover = () => {},
		onSelection,
		reactions = [],
		emojiProvider,
		allowAllEmojis,
		onReactionClick,
		allowUserDialog,
		onDialogOpenCallback = () => {},
		onDialogCloseCallback = () => {},
		onDialogSelectReactionCallback = () => {},
		onDialogPageChangeCallback = () => {},
		emojiPickerSize = 'medium',
		miniMode = false,
		summaryViewEnabled = false,
		summaryViewThreshold = 3,
		summaryViewPlacement,
		showOpaqueBackground = false,
		subtleReactionsSummaryAndPicker = false,
		showAddReactionText = false,
		hideDefaultReactions = false,
		ProfileCardWrapper,
		onlyRenderPicker = false,
		showRoundTrigger = false,
	}: ReactionsProps) => {
		const [selectedEmojiId, setSelectedEmojiId] = useState<string>();
		const { createAnalyticsEvent } = useAnalyticsEvents();
		const intl = useIntl();

		let openTime = useRef<number>();
		let renderTime = useRef<number>();

		useEffect(() => {
			if (status === ReactionStatus.notLoaded) {
				loadReaction();
			}
		}, [status, loadReaction]);

		useEffect(() => {
			if (status !== ReactionStatus.ready) {
				renderTime.current = Date.now();
			} else {
				const isSSR = process.env.REACT_SSR && fg('platform_fix_analytics_error');
				if (isSampled(SAMPLING_RATE_REACTIONS_RENDERED_EXP) && !isSSR) {
					createAndFireSafe(
						createAnalyticsEvent,
						createReactionsRenderedEvent,
						renderTime.current ?? Date.now(), //renderTime.current can be null during unit test cases
					);
				}
				renderTime.current = undefined;
			}
		}, [createAnalyticsEvent, status]);

		const handleReactionMouseEnter = useCallback(
			(emojiId: string) => {
				getReactionDetails(emojiId);
				onReactionHover(emojiId);
			},
			[getReactionDetails, onReactionHover],
		);

		const handleReactionFocused = useCallback(
			(emojiId: string) => {
				getReactionDetails(emojiId);
			},
			[getReactionDetails],
		);

		const handlePickerOpen = useCallback(() => {
			openTime.current = Date.now();
			createAndFireSafe(createAnalyticsEvent, createPickerButtonClickedEvent, reactions.length);
		}, [createAnalyticsEvent, reactions]);

		const handleOnCancel = useCallback(() => {
			createAndFireSafe(createAnalyticsEvent, createPickerCancelledEvent, openTime.current);
			openTime.current = undefined;
		}, [createAnalyticsEvent]);

		const handleOnMore = useCallback(() => {
			createAndFireSafe(createAnalyticsEvent, createPickerMoreClickedEvent, openTime.current);
		}, [createAnalyticsEvent]);

		const handleOnSelection = useCallback(
			(emojiId: string, source: ReactionSource) => {
				createAndFireSafe(
					createAnalyticsEvent,
					createReactionSelectionEvent,
					source,
					emojiId,
					reactions.find((reaction) => reaction.emojiId === emojiId),
					openTime.current,
				);
				openTime.current = undefined;
				onSelection(emojiId);
			},
			[createAnalyticsEvent, onSelection, reactions],
		);

		/**
		 * event handler to open dialog with selected reaction
		 * @param emojiId selected emoji id
		 */
		const handleOpenReactionsDialog = (emojiId: string) => {
			// ufo start opening reaction dialog
			ufoExperiences.openDialog.start();
			getReactionDetails(emojiId);
			setSelectedEmojiId(emojiId);
			onDialogOpenCallback(emojiId, 'button');

			// ufo opening reaction dialog success
			ufoExperiences.openDialog.success({
				metadata: {
					emojiId,
					source: 'Reactions',
					reason: 'Opening Reactions Dialog successfully',
				},
			});
		};

		const handleCloseReactionsDialog: OnCloseHandler = (
			e: KeyboardOrMouseEvent,
			analyticsEvent: UIAnalyticsEvent,
		) => {
			// ufo closing opening reaction dialog
			ufoExperiences.closeDialog.start();

			setSelectedEmojiId('');
			onDialogCloseCallback(e, analyticsEvent);

			// ufo closing reaction dialog success
			ufoExperiences.closeDialog.success({
				metadata: {
					source: 'Reactions',
					reason: 'Closing reactions dialog successfully',
				},
			});
		};

		const handleSelectReactionInDialog = (emojiId: string) => {
			// ufo selected reaction inside the modal dialog
			ufoExperiences.selectedReactionChangeInsideDialog.start();

			handleReactionMouseEnter(emojiId);
			setSelectedEmojiId(emojiId);
			onDialogSelectReactionCallback(emojiId);

			// ufo selected reaction inside the modal dialog success
			ufoExperiences.selectedReactionChangeInsideDialog.success({
				metadata: {
					emojiId,
					source: 'Reactions',
					reason: 'Selected Emoji changed',
				},
			});
		};

		const handlePaginationChange = useCallback(
			(emojiId: string, currentPage: number, maxPages: number) => {
				ufoExperiences.pageNavigated.start();

				// fetch the latest active emoji from the new page
				getReactionDetails(emojiId);
				setSelectedEmojiId(emojiId);
				onDialogPageChangeCallback(emojiId, currentPage, maxPages);

				ufoExperiences.pageNavigated.success({
					metadata: {
						emojiId,
						source: 'Reactions Dialog',
						reason: 'Navigated to new page',
					},
				});
			},
			// Exclude unstable getReactionDetails to avoid extra re-renders
			// eslint-disable-next-line react-hooks/exhaustive-deps
			[setSelectedEmojiId],
		);

		/**
		 * Get the reactions that we want to render are any reactions with a count greater than zero as well as any default emoji not already shown
		 */
		const memorizedReactions = useMemo(() => {
			//
			/**
			 * If reactions not empty, don't show quick reactions Pre defined emoji or if its empty and default reactions not hidden => return the current list of reactions
			 */
			if (
				(reactions.length === 0 && hideDefaultReactions) ||
				reactions.length > 0 ||
				!quickReactionEmojis
			) {
				return reactions;
			}

			// add any missing default reactions
			const { ari, containerAri, emojiIds } = quickReactionEmojis;
			const items: ReactionSummary[] = emojiIds
				.filter((emojiId) => !reactions.some((reaction) => reaction.emojiId === emojiId))
				.map((emojiId) => {
					return {
						ari,
						containerAri,
						emojiId,
						count: 0,
						reacted: false,
					};
				});
			return reactions.concat(items);
		}, [quickReactionEmojis, reactions, hideDefaultReactions]);

		const shouldShowSummaryView =
			summaryViewEnabled &&
			memorizedReactions.length >= summaryViewThreshold &&
			reactions.length > 0;

		// criteria to show Reactions Dialog
		const hasEmojiWithFivePlusReactions = reactions.some((reaction) => reaction.count >= 5);

		const sortedReactions = useMemo(() => {
			return [...memorizedReactions].sort((a, b) => b?.count - a?.count);
		}, [memorizedReactions]);

		return (
			// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			<div css={wrapperStyle} data-testid={RENDER_REACTIONS_TESTID}>
				{!onlyRenderPicker &&
					(shouldShowSummaryView ? (
						<div data-testid={RENDER_REACTIONS_SUMMARY_TESTID}>
							<ReactionSummaryView
								reactions={sortedReactions}
								emojiProvider={emojiProvider}
								flash={flash}
								particleEffectByEmoji={particleEffectByEmoji}
								onReactionClick={onReactionClick}
								onReactionFocused={handleReactionFocused}
								onReactionMouseEnter={handleReactionMouseEnter}
								placement={summaryViewPlacement}
								showOpaqueBackground={showOpaqueBackground}
								subtleReactionsSummaryAndPicker={subtleReactionsSummaryAndPicker}
								handleOpenReactionsDialog={handleOpenReactionsDialog}
								allowUserDialog={allowUserDialog && hasEmojiWithFivePlusReactions}
							/>
						</div>
					) : (
						memorizedReactions.map((reaction) => (
							<Reaction
								key={reaction.emojiId}
								reaction={reaction}
								emojiProvider={emojiProvider}
								onClick={onReactionClick}
								onMouseEnter={handleReactionMouseEnter}
								onFocused={handleReactionFocused}
								flash={flash[reaction.emojiId]}
								showParticleEffect={particleEffectByEmoji[reaction.emojiId]}
								showOpaqueBackground={showOpaqueBackground}
							/>
						))
					))}
				{!onlyRenderPicker &&
					allowUserDialog &&
					hasEmojiWithFivePlusReactions &&
					!shouldShowSummaryView && (
						<Box xcss={dialogEntrypointButtonStyle}>
							<Pressable backgroundColor="color.background.neutral.subtle" padding="space.0">
								<Tooltip content={intl.formatMessage(messages.seeWhoReactedTooltip)}>
									{(tooltipProps) => (
										<Button
											{...tooltipProps}
											spacing="compact"
											onClick={() => handleOpenReactionsDialog(sortedReactions[0].emojiId)}
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
				<ReactionPicker
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
					css={reactionPickerStyle}
					emojiProvider={emojiProvider}
					allowAllEmojis={allowAllEmojis}
					pickerQuickReactionEmojiIds={pickerQuickReactionEmojiIds}
					disabled={status !== ReactionStatus.ready}
					onSelection={handleOnSelection}
					onOpen={handlePickerOpen}
					onCancel={handleOnCancel}
					onShowMore={handleOnMore}
					tooltipContent={getTooltip(status, errorMessage)}
					emojiPickerSize={emojiPickerSize}
					miniMode={miniMode}
					showOpaqueBackground={showOpaqueBackground}
					showAddReactionText={showAddReactionText}
					subtleReactionsSummaryAndPicker={subtleReactionsSummaryAndPicker}
					showRoundTrigger={showRoundTrigger}
				/>
				<ModalTransition>
					{!!selectedEmojiId && (
						<ReactionsDialog
							selectedEmojiId={selectedEmojiId}
							reactions={sortedReactions}
							emojiProvider={emojiProvider}
							handleCloseReactionsDialog={handleCloseReactionsDialog}
							handleSelectReaction={handleSelectReactionInDialog}
							handlePaginationChange={handlePaginationChange}
							ProfileCardWrapper={ProfileCardWrapper}
						/>
					)}
				</ModalTransition>
			</div>
		);
	},
);
