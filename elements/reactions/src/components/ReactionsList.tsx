import React from 'react';

import { type ReactionSummary, type ProfileCardWrapper } from '../types';
import { Box } from '@atlaskit/primitives/compiled';

import { ReactionView } from './ReactionView';

export interface ReactionsListProps {
	/**
	 * Provider for loading emojis
	 */
	/**
	 * A functional component from Confluence to show a profile card on hover
	 */
	ProfileCardWrapper?: ProfileCardWrapper;
	/**
	 * Sorted list of reactions to render in list
	 */
	reactions: ReactionSummary[];
	/**
	 * Current emoji selected in the reactions dialog
	 */
	selectedEmojiId: string;
}

export const ReactionsList = ({
	reactions,
	selectedEmojiId,
	ProfileCardWrapper,
}: ReactionsListProps) => {
	return (
		<Box>
			{reactions.map((reaction) => {
				if (reaction.emojiId === selectedEmojiId) {
					return (
						<ReactionView
							key={reaction.emojiId}
							reaction={reaction}
							ProfileCardWrapper={ProfileCardWrapper}
						/>
					);
				} else {
					return null;
				}
			})}
		</Box>
	);
};
