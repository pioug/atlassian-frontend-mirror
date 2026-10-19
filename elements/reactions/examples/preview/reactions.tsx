import React from 'react';

import { IntlProvider } from 'react-intl';

import type { EmojiProvider } from '@atlaskit/emoji/types';
import { ari, getReactionSummary } from '@atlaskit/reactions/MockReactionsClient';
import { ReactionStatus } from '@atlaskit/reactions/reaction';
import { Reactions } from '@atlaskit/reactions/Reactions';
import { getEmojiResource } from '@atlaskit/util-data-test/get-emoji-resource';

export default function ReactionsPreview(): React.JSX.Element {
	return (
		<IntlProvider locale="en">
			<div data-testid="component-preview">
				<Reactions
					contentId={ari}
					emojiProvider={getEmojiResource() as Promise<EmojiProvider>}
					status={ReactionStatus.ready}
					reactions={[getReactionSummary(':fire:', 1, true)]}
					loadReaction={() => {}}
					onReactionClick={() => {}}
					onSelection={() => {}}
				/>
			</div>
		</IntlProvider>
	);
}
