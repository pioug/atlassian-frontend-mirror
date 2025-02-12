/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { type EmojiProvider } from '@atlaskit/emoji/resource';
import { type ReactionSummary, type ProfileCardWrapper } from '../../types';
import { Box } from '@atlaskit/primitives';

import { ReactionView } from './ReactionView';

export interface ReactionsListProps {
	/**
	 * Sorted list of reactions to render in list
	 */
	reactions: ReactionSummary[];
	/**
	 * Current emoji selected in the reactions dialog
	 */
	selectedEmojiId: string;
	/**
	 * Provider for loading emojis
	 */
	emojiProvider: Promise<EmojiProvider>;
	/**
	 * A functional component from Confluence to show a profile card on hover
	 */
	ProfileCardWrapper?: ProfileCardWrapper;
}

export const ReactionsList = ({
	reactions,
	selectedEmojiId,
	emojiProvider,
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
							selectedEmojiId={selectedEmojiId}
							emojiProvider={emojiProvider}
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
