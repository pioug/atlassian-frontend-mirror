import React, { useState } from 'react';

import { IntlProvider } from 'react-intl';

import type { EmojiProvider } from '@atlaskit/emoji/types';
import { ReactionStatus, type ReactionSummary } from '@atlaskit/reactions/reaction-types';
import { Reactions } from '@atlaskit/reactions/Reactions';

export default function ReactionsExample({
	emojiProvider,
}: {
	emojiProvider: Promise<EmojiProvider>;
}): React.JSX.Element {
	const [reactions, setReactions] = useState<ReactionSummary[]>([]);
	const toggle = (emojiId: string) =>
		setReactions((current) => {
			const existing = current.find((reaction) => reaction.emojiId === emojiId);
			if (!existing)
				return [
					...current,
					{
						ari: 'ari:cloud:host:comment/456',
						containerAri: 'ari:cloud:host:container/123',
						emojiId,
						count: 1,
						reacted: true,
					},
				];
			return current.map((reaction) =>
				reaction.emojiId === emojiId
					? {
							...reaction,
							reacted: !reaction.reacted,
							count: reaction.count + (reaction.reacted ? -1 : 1),
						}
					: reaction,
			);
		});
	return (
		<IntlProvider locale="en">
			<Reactions
				contentId="ari:cloud:host:comment/456"
				emojiProvider={emojiProvider}
				status={ReactionStatus.ready}
				reactions={reactions}
				loadReaction={() => {}}
				onReactionClick={toggle}
				onSelection={toggle}
			/>
		</IntlProvider>
	);
}
