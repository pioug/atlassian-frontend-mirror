/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useEffect, useState, useCallback, useMemo } from 'react';
import { css, cssMap, jsx } from '@compiled/react';
import { token } from '@atlaskit/tokens';
import Tabs from '@atlaskit/tabs';
import { type EmojiProvider } from '@atlaskit/emoji/resource';
import Modal, { ModalBody, type OnCloseHandler } from '@atlaskit/modal-dialog';
import { type SelectedType } from '@atlaskit/tabs/types';
import { Box } from '@atlaskit/primitives/compiled';

import { NUMBER_OF_REACTIONS_TO_DISPLAY } from '../shared/constants';
import { type ReactionSummary, type ProfileCardWrapper } from '../types';

import { ReactionsList } from './ReactionsList';
import { ReactionsDialogHeader } from './ReactionsDialogHeader';

const styles = cssMap({
	modalBodyStyle: { marginBottom: token('space.300') },
});

/* Reactions Container. Using pseudo Element :after to set border since with onClick of Reaction to higlight the
border blue below the reaction. */
const containerStyle = css({
	overflow: 'hidden',
	height: '100%',
	display: 'flex',
	justifyContent: 'start',
	position: 'relative',
	scrollBehavior: 'smooth',
	'&::after': {
		content: '""',
		zIndex: 0,
		display: 'block',
		minWidth: '100%',
		bottom: '0px',
		position: 'absolute',
	},
});

/**
 * Test id for the Reactions modal dialog
 */
export const RENDER_MODAL_TESTID = 'render-reactions-modal';

export interface ReactionsDialogProps {
	/**
	 * Provider for loading emojis
	 */
	emojiProvider: Promise<EmojiProvider>;
	/**
	 * Optional handler when the dialog closes
	 */
	handleCloseReactionsDialog: OnCloseHandler;
	handlePaginationChange?: (emojiId: string, currentPage: number, maxPages: number) => void;
	/**
	 * Optional callback function called when user selects a reaction in reactions dialog
	 */
	handleSelectReaction?: (emojiId: string) => void;
	ProfileCardWrapper?: ProfileCardWrapper;
	/**
	 * List of reactions to render (defaults to empty list)
	 */
	reactions: ReactionSummary[];
	/**
	 * Current emoji selected to show the reactions dialog
	 */
	selectedEmojiId: string;
}

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
					<Box xcss={styles.modalBodyStyle}>
						<div css={containerStyle}>
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
