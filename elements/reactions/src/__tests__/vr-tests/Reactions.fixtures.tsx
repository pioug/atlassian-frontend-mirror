import React from 'react';

import { Reactions, ReactionStatus } from '../../../src/';
import { currentUser, getEmojiProvider } from '@atlaskit/util-data-test/get-emoji-provider';
import { getMockEmojis } from '@atlaskit/editor-test-helpers/mock-emojis';
import { ReactionSummary } from '../../types';
import { Constants as ExampleConstants } from '../../../examples/utils';
import { IntlProvider } from 'react-intl-next';

const containerAri = `${ExampleConstants.ContainerAriPrefix}1`;
const ari = `${ExampleConstants.AriPrefix}1`;

const useEmojiProvider = () => {
	return getEmojiProvider(
		{
			currentUser,
		},
		getMockEmojis,
	);
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
	const emojiProvider = useEmojiProvider();

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
	const emojiProvider = useEmojiProvider();

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
	const emojiProvider = useEmojiProvider();

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
	const emojiProvider = useEmojiProvider();

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
	const emojiProvider = useEmojiProvider();

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

export const ReactionsWithShowAddReactionText = () => {
	const emojiProvider = useEmojiProvider();

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
				showAddReactionText
			/>
		</IntlProvider>
	);
};

export const LoadedReactionSingleReactionReacted = () => {
	const emojiProvider = useEmojiProvider();

	return (
		<IntlProvider locale="en">
			<Reactions
				emojiProvider={emojiProvider}
				reactions={loadedReactions.slice(0, 1)}
				status={ReactionStatus.ready}
				loadReaction={loadReaction}
				onSelection={onSelection}
				onReactionClick={onReactionClick}
				allowAllEmojis
			/>
		</IntlProvider>
	);
};

export const LoadedReactionSingleReaction = () => {
	const emojiProvider = useEmojiProvider();

	return (
		<IntlProvider locale="en">
			<Reactions
				emojiProvider={emojiProvider}
				reactions={loadedReactions.slice(1, 2)}
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
	const emojiProvider = useEmojiProvider();

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

export const LoadedReactionsWithOpaqueBackground = () => {
	const emojiProvider = useEmojiProvider();

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
				showOpaqueBackground
			/>
		</IntlProvider>
	);
};

export const LoadedReactionsWithOnlyRenderPicker = () => {
	const emojiProvider = useEmojiProvider();

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
				onlyRenderPicker
			/>
		</IntlProvider>
	);
};

export const StaticReactions = () => {
	const emojiProvider = useEmojiProvider();

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

export const StaticReactionsSingleReaction = () => {
	const emojiProvider = useEmojiProvider();

	return (
		<IntlProvider locale="en">
			<Reactions
				emojiProvider={emojiProvider}
				reactions={loadedReactions.slice(0, 1)}
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
	const emojiProvider = useEmojiProvider();

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
