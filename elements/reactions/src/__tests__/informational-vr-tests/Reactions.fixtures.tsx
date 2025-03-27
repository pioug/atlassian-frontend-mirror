import React from 'react';

import { Reactions, ReactionStatus } from '../../../src/';
import { ReactionSummary } from '../../types';
import { Constants as ExampleConstants } from '../../../examples/utils';
import { IntlProvider } from 'react-intl-next';
import { currentUser, getEmojiProvider } from '@atlaskit/util-data-test/get-emoji-provider';
import { getMockEmojisForReactions } from '@atlaskit/editor-test-helpers/mock-emojis';

const containerAri = `${ExampleConstants.ContainerAriPrefix}1`;
const ari = `${ExampleConstants.AriPrefix}1`;
const loadReaction = () => {};
const onSelection = () => {};
const onReactionClick = () => {};
const useEmojiProvider = () => {
	return getEmojiProvider(
		{
			currentUser,
		},
		getMockEmojisForReactions,
	);
};

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
		count: 10,
		emojiId: 'atlassian-blue_star',
		users: [
			{
				id: 'spiderman',
				displayName: 'Spiderman',
			},
			{
				id: 'ironman',
				displayName: 'Ironman',
			},
			{
				id: 'captainamerica',
				displayName: 'Captain America',
			},
			{
				id: 'hulk',
				displayName: 'Hulk',
			},
			{
				id: 'thor',
				displayName: 'Thor',
			},
			{
				id: 'blackwidow',
				displayName: 'Black Widow',
			},
			{
				id: 'hawkeye',
				displayName: 'Hawkeye',
			},
			{
				id: 'scarletwitch',
				displayName: 'Scarlet Witch',
			},
			{
				id: 'vision',
				displayName: 'Vision',
			},
			{
				id: 'falcon',
				displayName: 'Falcon',
			},
		],
		reacted: false,
	},
	{
		containerAri,
		ari,
		count: 1,
		emojiId: 'wtf',
		users: [
			{
				id: 'falcon',
				displayName: 'Falcon',
			},
		],
		reacted: false,
	},
];

export const LoadedReactions = () => <LoadedReactionsCreater />;
export const LoadedReactionsMiniMode = () => <LoadedReactionsCreater miniMode />;
export const LoadedReactionsDisallowAllEmojis = () => (
	<LoadedReactionsCreater allowAllEmojis={false} />
);
export const LoadedReactionsWithPickerQuickReactionEmojiIds = () => {
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
				pickerQuickReactionEmojiIds={[{ id: '2764', shortName: ':heart:' }]}
			/>
		</IntlProvider>
	);
};

const LoadedReactionsCreater = ({
	subtleReactionsSummaryAndPicker = false,
	showOpaqueBackground = false,
	isViewOnly = false,
	allowSelectFromSummaryView = false,
	summaryViewEnabled = false,
	miniMode = false,
	allowAllEmojis = true,
}) => {
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
				allowAllEmojis={allowAllEmojis}
				summaryViewEnabled={summaryViewEnabled}
				subtleReactionsSummaryAndPicker={subtleReactionsSummaryAndPicker}
				showOpaqueBackground={showOpaqueBackground}
				isViewOnly={isViewOnly}
				allowSelectFromSummaryView={allowSelectFromSummaryView}
				miniMode={miniMode}
			/>
		</IntlProvider>
	);
};
