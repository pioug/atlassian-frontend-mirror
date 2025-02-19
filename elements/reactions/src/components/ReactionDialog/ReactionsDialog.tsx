/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useEffect, useState, useCallback, useMemo } from 'react';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import Tabs from '@atlaskit/tabs';
import { type EmojiProvider } from '@atlaskit/emoji/resource';
import Modal, { ModalBody, type OnCloseHandler } from '@atlaskit/modal-dialog';
import { type SelectedType } from '@atlaskit/tabs/types';
import { Box, xcss } from '@atlaskit/primitives';

import { NUMBER_OF_REACTIONS_TO_DISPLAY } from '../../shared/constants';
import { type ReactionSummary, type ProfileCardWrapper } from '../../types';

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
	handleSelectReaction?: (emojiId: string) => void;
	handlePaginationChange?: (emojiId: string, currentPage: number, maxPages: number) => void;
	ProfileCardWrapper?: ProfileCardWrapper;
}

const modalBodyStyle = xcss({ marginBottom: 'space.300' });

export const ReactionsDialog = ({
	reactions = [],
	handleCloseReactionsDialog = () => {},
	emojiProvider,
	selectedEmojiId,
	handleSelectReaction = () => {},
	handlePaginationChange = () => {},
	ProfileCardWrapper,
}: ReactionsDialogProps) => {
	const [hasNavigatedPages, setHasNavigatedPages] = useState<boolean>(false);
	const [currentPage, setCurrentPage] = useState(1);

	const totalReactionsCount = useMemo(() => {
		return reactions.reduce((accum: number, current: ReactionSummary) => {
			return (accum += current?.count);
		}, 0);
	}, [reactions]);

	const maxPages = Math.max(1, Math.ceil(reactions.length / NUMBER_OF_REACTIONS_TO_DISPLAY));

	const currentReactions = useMemo(() => {
		const start = (currentPage - 1) * NUMBER_OF_REACTIONS_TO_DISPLAY;
		const end = start + NUMBER_OF_REACTIONS_TO_DISPLAY;
		return reactions.slice(start, end);
	}, [reactions, currentPage]);

	const handleNextPage = () => {
		setCurrentPage((prevPage) => Math.min(prevPage + 1, maxPages));
		setHasNavigatedPages(true);
	};
	const handlePreviousPage = () => {
		setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
		setHasNavigatedPages(true);
	};

	const firstEmojiOnPage = currentReactions[0]?.emojiId;
	useEffect(() => {
		// trigger the handler with the first emoji when the page changes
		if (hasNavigatedPages && firstEmojiOnPage) {
			handlePaginationChange(firstEmojiOnPage, currentPage, maxPages);
		}
	}, [hasNavigatedPages, currentPage, maxPages, firstEmojiOnPage, handlePaginationChange]);

	/* set Reactions Border Width , 8 Number of reactions to display*/
	const reactionsBorderWidth = useMemo(() => {
		return (Math.ceil(reactions.length / NUMBER_OF_REACTIONS_TO_DISPLAY) * 100) as number;
	}, [reactions]);

	const selectedIndex = currentReactions.findIndex(
		(reaction) => reaction.emojiId === selectedEmojiId,
	);

	const onTabChange = useCallback(
		(index: SelectedType) => {
			if (index === selectedIndex) {
				return;
			}
			const emojiId = currentReactions[index].emojiId;
			handleSelectReaction(emojiId);
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
					currentReactions={currentReactions}
					handleCloseReactionsDialog={handleCloseReactionsDialog}
				/>
				<ModalBody>
					<Box xcss={modalBodyStyle}>
						{/* eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766 */}
						<div css={containerStyle(reactionsBorderWidth)}>
							<ReactionsList
								selectedEmojiId={selectedEmojiId}
								reactions={currentReactions}
								ProfileCardWrapper={ProfileCardWrapper}
							/>
						</div>
					</Box>
				</ModalBody>
			</Tabs>
		</Modal>
	);
};
