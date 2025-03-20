import React, { useMemo } from 'react';

import { Reactions, ReactionStatus } from '../../../src/';
import { currentUser, getEmojiProvider } from '@atlaskit/util-data-test/get-emoji-provider';
import { getFallbackEmojis, getMockEmojis } from '@atlaskit/editor-test-helpers/mock-emojis';
import { ReactionSummary } from '../../types';
import { Constants as ExampleConstants } from '../../../examples/utils';
import { IntlProvider } from 'react-intl-next';
import { EmojiProvider } from '@atlaskit/emoji';

const containerAri = `${ExampleConstants.ContainerAriPrefix}1`;
const ari = `${ExampleConstants.AriPrefix}1`;

const useProvider = (useFallback: boolean = false) => {
	return useMemo<Promise<EmojiProvider>>(() => {
		return getEmojiProvider(
			{
				currentUser,
			},
			useFallback ? getFallbackEmojis : getMockEmojis,
		);
	}, [useFallback]);
};
const loadReaction = () => {};
const onSelection = () => {};
const onReactionClick = () => {};

const loadedReactions: ReactionSummary[] = [
	{
		containerAri,
		ari,
		count: 1,
		emojiId: '1f600',
		users: [{ id: currentUser.id, displayName: 'Black Panther' }],
		reacted: true,
	},
	{
		containerAri,
		ari,
		count: 99,
		emojiId: 'atlassian-blue_star',
		users: [{ id: currentUser.id, displayName: 'Black Panther' }],
		reacted: false,
	},
	{
		containerAri,
		ari,
		count: 1,
		emojiId: 'wtf',
		users: [{ id: currentUser.id, displayName: 'Black Panther' }],
		reacted: false,
	},
];

export const DisabledReactions = () => {
	const emojiProvider = useProvider(false);

	return (
		<IntlProvider locale="en">
			<Reactions
				emojiProvider={emojiProvider}
				reactions={[]}
				status={ReactionStatus.disabled}
				loadReaction={loadReaction}
				onSelection={onSelection}
				onReactionClick={onReactionClick}
				allowAllEmojis
			/>
		</IntlProvider>
	);
};

export const NotLoadedReactions = () => {
	const emojiProvider = useProvider(false);

	return (
		<IntlProvider locale="en">
			<Reactions
				emojiProvider={emojiProvider}
				reactions={[]}
				status={ReactionStatus.notLoaded}
				loadReaction={loadReaction}
				onSelection={onSelection}
				onReactionClick={onReactionClick}
				allowAllEmojis
			/>
		</IntlProvider>
	);
};

export const LoadingReactions = () => {
	const emojiProvider = useProvider(false);

	return (
		<IntlProvider locale="en">
			<Reactions
				emojiProvider={emojiProvider}
				reactions={[]}
				status={ReactionStatus.loading}
				loadReaction={loadReaction}
				onSelection={onSelection}
				onReactionClick={onReactionClick}
				allowAllEmojis
			/>
		</IntlProvider>
	);
};

export const ErrorReactions = () => {
	const emojiProvider = useProvider(false);

	return (
		<IntlProvider locale="en">
			<Reactions
				emojiProvider={emojiProvider}
				reactions={[]}
				status={ReactionStatus.error}
				loadReaction={loadReaction}
				onSelection={onSelection}
				onReactionClick={onReactionClick}
				errorMessage={'No reactions could be loaded'}
				allowAllEmojis
			/>
		</IntlProvider>
	);
};

export const LoadedReactions = () => {
	const emojiProvider = useProvider(false);

	return (
		<IntlProvider locale="en">
			<Reactions
				emojiProvider={emojiProvider}
				reactions={loadedReactions}
				status={ReactionStatus.ready}
				loadReaction={loadReaction}
				onSelection={onSelection}
				onReactionClick={onReactionClick}
				allowAllEmojis
			/>
		</IntlProvider>
	);
};

export const LoadedReactionsMiniMode = () => {
	const emojiProvider = useProvider(false);

	return (
		<IntlProvider locale="en">
			<Reactions
				emojiProvider={emojiProvider}
				reactions={loadedReactions}
				status={ReactionStatus.ready}
				loadReaction={loadReaction}
				onSelection={onSelection}
				onReactionClick={onReactionClick}
				allowAllEmojis
				miniMode
			/>
		</IntlProvider>
	);
};

export const StaticReactions = () => {
	const emojiProvider = useProvider(false);

	return (
		<IntlProvider locale="en">
			<Reactions
				emojiProvider={emojiProvider}
				reactions={loadedReactions}
				status={ReactionStatus.ready}
				loadReaction={loadReaction}
				onSelection={onSelection}
				onReactionClick={onReactionClick}
				allowAllEmojis
				isViewOnly
			/>
		</IntlProvider>
	);
};

export const QuickReactions = () => {
	const emojiProvider = useProvider(false);

	return (
		<IntlProvider locale="en">
			<Reactions
				emojiProvider={emojiProvider}
				reactions={[]}
				status={ReactionStatus.ready}
				loadReaction={loadReaction}
				onSelection={onSelection}
				onReactionClick={onReactionClick}
				allowAllEmojis
				quickReactionEmojis={{
					ari,
					containerAri,
					emojiIds: ['1f600', 'atlassian-blue_star', 'wtf'],
				}}
			/>
		</IntlProvider>
	);
};
