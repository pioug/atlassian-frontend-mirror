/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useIntl } from 'react-intl-next';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import Tabs from '@atlaskit/tabs';
import Button from '@atlaskit/button/new';
import { Box, xcss } from '@atlaskit/primitives';
import { type EmojiProvider } from '@atlaskit/emoji/resource';
import Modal, { ModalBody, ModalFooter, type OnCloseHandler } from '@atlaskit/modal-dialog';
import { type UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { type SelectedType } from '@atlaskit/tabs/types';
import { token } from '@atlaskit/tokens';

import { NUMBER_OF_REACTIONS_TO_DISPLAY } from '../../shared/constants';
import { messages } from '../../shared/i18n';
import {
	type onDialogSelectReactionChange,
	type ReactionSummary,
	type ProfileCardWrapper,
} from '../../types';

import { ReactionsList } from './ReactionsList';
import { ReactionsDialogHeader } from './ReactionsDialogHeader';
import { containerStyle } from './styles';

/**
 * Test id for the Reactions modal dialog
 */
export const RENDER_MODAL_TESTID = 'render-reactions-modal';

export interface ReactionsDialogProps {
	/**
	 * List of reactions to render (defaults to empty list)
	 */
	reactions: ReactionSummary[];
	/**
	 * Optional handler when the dialog closes
	 */
	handleCloseReactionsDialog: OnCloseHandler;
	/**
	 * Provider for loading emojis
	 */
	emojiProvider: Promise<EmojiProvider>;
	/**
	 * Current emoji selected to show the reactions dialog
	 */
	selectedEmojiId: string;
	/**
	 * Optional callback function called when user selects a reaction in reactions dialog
	 */
	handleSelectReaction?: onDialogSelectReactionChange;
	handlePaginationChange?: (emojiId: string) => void;
	ProfileCardWrapper?: ProfileCardWrapper;
}

const getDimensions = (container: HTMLDivElement) => {
	return {
		clientWidth: container?.clientWidth,
		scrollWidth: container?.scrollWidth,
		scrollLeft: container?.scrollLeft,
	};
};

const footerStyle = xcss({
	borderTop: `2px solid ${token('color.border', 'rgba(11, 18, 14, 0.14)')}`,
});

export const ReactionsDialog = ({
	reactions = [],
	handleCloseReactionsDialog = () => {},
	emojiProvider,
	selectedEmojiId,
	handleSelectReaction = () => {},
	handlePaginationChange = () => {},
	ProfileCardWrapper,
}: ReactionsDialogProps) => {
	const [elementToScroll, setElementToScroll] = useState<Element>();

	const [reactionsContainerRef, setReactionsContainerRef] = useState<HTMLDivElement | null>(null);

	const reactionElementsRef = useRef<NodeListOf<HTMLElement>>();
	const observerRef = useRef<IntersectionObserver>();
	const intl = useIntl();
	const isSelectedEmojiViewed = useRef(false);

	const totalReactionsCount = useMemo(() => {
		return reactions.reduce((accum: number, current: ReactionSummary) => {
			return (accum += current?.count);
		}, 0);
	}, [reactions]);

	const sortedReactions = useMemo(() => {
		return [...reactions].sort((a, b) => b?.count - a?.count);
	}, [reactions]);

	const maxPages = Math.max(1, Math.ceil(reactions.length / NUMBER_OF_REACTIONS_TO_DISPLAY));
	const [currentPage, setCurrentPage] = useState(1);

	const currentReactions = useMemo(() => {
		const start = (currentPage - 1) * NUMBER_OF_REACTIONS_TO_DISPLAY;
		const end = start + NUMBER_OF_REACTIONS_TO_DISPLAY;
		return sortedReactions.slice(start, end);
	}, [sortedReactions, currentPage]);

	const handleNextPage = () => {
		setCurrentPage((prevPage) => Math.min(prevPage + 1, maxPages));
	};
	const handlePreviousPage = () => {
		setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
	};

	const firstEmojiOnPage = currentReactions[0]?.emojiId;
	useEffect(() => {
		// trigger the handler with the first emoji when the page changes
		if (firstEmojiOnPage) {
			handlePaginationChange(firstEmojiOnPage);
		}
	}, [currentPage, firstEmojiOnPage, handlePaginationChange]);

	/* set Reactions Border Width , 8 Number of reactions to display*/
	const reactionsBorderWidth = useMemo(() => {
		return (Math.ceil(reactions.length / NUMBER_OF_REACTIONS_TO_DISPLAY) * 100) as number;
	}, [reactions]);

	/* Callback from IntersectionObserver to set/unset classNames based on visibility to toggle styles*/
	const handleNavigation = useCallback(
		(entries: IntersectionObserverEntry[]) => {
			entries.forEach((entry: IntersectionObserverEntry) => {
				const element = entry.target;
				const emojiElement = element?.querySelector('[data-emoji-id]');
				const emojiId = (emojiElement as HTMLElement)?.dataset?.emojiId;
				if (entry.intersectionRatio < 1) {
					element.classList.add('disabled');
					/*Check if selectedEmoji (passed as props based on what user selects) is out of viewport */
					if (emojiId === selectedEmojiId && !isSelectedEmojiViewed.current) {
						setElementToScroll(emojiElement ?? undefined);
					}
				} else {
					if (emojiId === selectedEmojiId && !isSelectedEmojiViewed.current) {
						isSelectedEmojiViewed.current = true;
					}
					element.classList.remove('disabled');
				}
			});
		},
		[selectedEmojiId],
	);

	useEffect(() => {
		if (elementToScroll && !isSelectedEmojiViewed.current && reactionsContainerRef) {
			isSelectedEmojiViewed.current = true;
			const parentElement = elementToScroll.closest('.reaction-elements');

			const reactionsList = document.querySelector('#reactions-dialog-tabs-list');
			const { clientWidth } = getDimensions(reactionsList as HTMLDivElement);

			const offsetLeft = (parentElement as HTMLElement)?.offsetLeft;
			/* which means emoji is not in viewport so scroll to it*/
			if (reactionsList && offsetLeft > clientWidth) {
				const scrollBy = Math.trunc(offsetLeft / clientWidth) * clientWidth;
				reactionsList.scrollLeft += scrollBy;
			}
		}
	}, [elementToScroll, reactionsContainerRef]);

	/* Set up InterSectionObserver to observer reaction elements on navigating*/
	useEffect(() => {
		if (reactionsContainerRef) {
			const options = {
				root: reactionsContainerRef,
				rootMargin: '0px',
				threshold: 1.0,
			};

			observerRef.current = new IntersectionObserver(handleNavigation, options);

			reactionElementsRef.current = reactionsContainerRef.querySelectorAll('.reaction-elements');

			reactionElementsRef.current &&
				reactionElementsRef.current.length > 0 &&
				reactionElementsRef.current.forEach((child) => {
					observerRef?.current?.observe(child);
				});
		}

		return () => {
			if (observerRef.current) {
				observerRef.current.disconnect();
				observerRef.current = undefined;
			}
		};
	}, [reactionsContainerRef, reactions, handleNavigation, selectedEmojiId]);

	const setRef = useCallback((node: HTMLDivElement) => {
		if (!reactionsContainerRef) {
			setReactionsContainerRef(node);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const selectedIndex = currentReactions.findIndex(
		(reaction) => reaction.emojiId === selectedEmojiId,
	);

	const onTabChange = useCallback(
		(index: SelectedType, analyticsEvent: UIAnalyticsEvent) => {
			if (index === selectedIndex) {
				return;
			}
			const emojiId = currentReactions[index].emojiId;
			handleSelectReaction(emojiId, analyticsEvent);
		},
		[selectedIndex, currentReactions, handleSelectReaction],
	);

	return (
		<Modal
			onClose={handleCloseReactionsDialog}
			height={600}
			testId={RENDER_MODAL_TESTID}
			// eslint-disable-next-line jsx-a11y/no-autofocus
			autoFocus={false}
		>
			<Tabs id="reactions-dialog-tabs" onChange={onTabChange} selected={selectedIndex}>
				<ReactionsDialogHeader
					totalReactionsCount={totalReactionsCount}
					maxPages={maxPages}
					handlePreviousPage={handlePreviousPage}
					handleNextPage={handleNextPage}
					currentPage={currentPage}
					emojiProvider={emojiProvider}
					selectedEmojiId={selectedEmojiId}
					currentReactions={currentReactions}
				/>
				<ModalBody>
					{/* eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766 */}
					<div css={containerStyle(reactionsBorderWidth)} ref={setRef}>
						<ReactionsList
							selectedEmojiId={selectedEmojiId}
							reactions={currentReactions}
							emojiProvider={emojiProvider}
							ProfileCardWrapper={ProfileCardWrapper}
						/>
					</div>
				</ModalBody>
			</Tabs>

			<Box xcss={footerStyle}>
				<ModalFooter>
					<Button appearance="subtle" onClick={handleCloseReactionsDialog}>
						{intl.formatMessage(messages.closeReactionsDialog)}
					</Button>
				</ModalFooter>
			</Box>
		</Modal>
	);
};
