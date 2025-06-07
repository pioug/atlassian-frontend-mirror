import React from 'react';

import { Reactions, ReactionStatus } from '../..';
import { currentUser, getEmojiProvider } from '@atlaskit/util-data-test/get-emoji-provider';
import { getMockEmojis } from '@atlaskit/editor-test-helpers/mock-emojis';
import EmojiAddIcon from '@atlaskit/icon/core/emoji-add';
import AddIcon from '@atlaskit/icon/core/add';
import { token } from '@atlaskit/tokens';
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

export const EmptySummaryReactions = () => {
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
				summaryViewEnabled
			/>
		</IntlProvider>
	);
};

export const LoadedSummaryReactions = () => {
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
				summaryViewEnabled
			/>
		</IntlProvider>
	);
};

export const LoadedSummaryReactionsWithSubtleStyle = () => {
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
				summaryViewEnabled
				subtleReactionsSummaryAndPicker
			/>
		</IntlProvider>
	);
};

export const LoadedSummaryReactionsViewOnly = () => {
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
				summaryViewEnabled
				subtleReactionsSummaryAndPicker
				isViewOnly
			/>
		</IntlProvider>
	);
};

export const LoadedSummaryReactionsAllowSelectionFromEmojiPicker = () => {
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
				summaryViewEnabled
				allowSelectFromSummaryView
			/>
		</IntlProvider>
	);
};

export const LoadedSummaryReactionsWithIconAfter = () => {
	const emojiProvider = useEmojiProvider();
	const summaryButtonIconAfter = (
		<AddIcon testId="add-icon" color={token('color.icon.subtle')} label={'Add'} />
	);

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
				summaryViewEnabled
				subtleReactionsSummaryAndPicker
				summaryButtonIconAfter={summaryButtonIconAfter}
			/>
		</IntlProvider>
	);
};

export const LoadedSummaryReactionsAllowSelectionFromSummaryViewWithIconAfter = () => {
	const emojiProvider = useEmojiProvider();
	const summaryButtonIconAfter = (
		<EmojiAddIcon
			testId="emoji-add-icon"
			color={token('color.icon.subtle')}
			label={'Add Reaction'}
		/>
	);

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
				summaryViewEnabled
				subtleReactionsSummaryAndPicker
				allowSelectFromSummaryView
				summaryButtonIconAfter={summaryButtonIconAfter}
			/>
		</IntlProvider>
	);
};
