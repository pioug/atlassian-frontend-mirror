/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useCallback, useState, useEffect } from 'react';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { type UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { ResourcedEmoji } from '@atlaskit/emoji/element';
import { type EmojiProvider } from '@atlaskit/emoji/resource';
import Tabs, { Tab, TabList } from '@atlaskit/tabs';
import { useThemeObserver } from '@atlaskit/tokens';
import { type SelectedType } from '@atlaskit/tabs/types';
import { Box, Flex, xcss } from '@atlaskit/primitives';

import { type onDialogSelectReactionChange, type ReactionSummary } from '../../types';
import { Counter } from '../Counter';

import { customTabWrapper, customTabListStyles } from './styles';
import { ReactionView } from './ReactionView';

const emojiStyles = xcss({
	minWidth: '36px',
});

export interface ReactionsListProps {
	/**
	 * Sorted list of reactions to render in list
	 */
	reactions: ReactionSummary[];
	/**
	 * Current emoji selected in the reactions dialog
	 */
	initialEmojiId: string;
	/**
	 * Provider for loading emojis
	 */
	emojiProvider: Promise<EmojiProvider>;
	/**
	 * Function to handle clicking on an emoji from the list
	 */
	onReactionChanged: onDialogSelectReactionChange;
}

export const ReactionsList = ({
	reactions,
	initialEmojiId,
	emojiProvider,
	onReactionChanged,
}: ReactionsListProps) => {
	const [selectedEmoji, setSelectedEmoji] = useState(() => {
		// Calculate this only on initialize the List of Tabs and each Reactions View collection
		return {
			index: reactions.findIndex((reaction) => reaction.emojiId === initialEmojiId),
			id: initialEmojiId,
		};
	});
	const { colorMode } = useThemeObserver();

	useEffect(() => {
		// select first emoji when navigating to a new page
		const currentPageEmojis = reactions.map((reaction) => reaction.emojiId);
		if (!currentPageEmojis.includes(selectedEmoji.id)) {
			setSelectedEmoji({
				index: 0,
				id: initialEmojiId,
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [reactions, initialEmojiId]);

	const onTabChange = useCallback(
		(index: SelectedType, analyticsEvent: UIAnalyticsEvent) => {
			if (index === selectedEmoji.index) {
				return;
			}
			const emojiId = reactions[index].emojiId;
			setSelectedEmoji({ index, id: emojiId });
			onReactionChanged(emojiId, analyticsEvent);
		},
		[selectedEmoji.index, reactions, onReactionChanged],
	);

	return (
		<Tabs id="reactions-dialog-tabs" onChange={onTabChange} selected={selectedEmoji.index}>
			{/* eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766 */}
			<div css={customTabListStyles} id="reactions-dialog-tabs-list">
				<TabList>
					{reactions.map((reaction) => {
						const emojiId = { id: reaction.emojiId, shortName: '' };

						return (
							<div
								// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
								css={customTabWrapper(
									emojiId?.id === selectedEmoji.id,
									selectedEmoji.id,
									colorMode,
								)}
								// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
								className="reaction-elements"
								key={reaction.emojiId}
								data-testid={emojiId?.id}
							>
								<Tab>
									<Flex justifyContent="center" alignItems="center" direction="row">
										<Box xcss={emojiStyles}>
											<ResourcedEmoji
												emojiProvider={emojiProvider}
												emojiId={emojiId}
												fitToHeight={16}
												showTooltip
											/>
										</Box>
										<Counter value={reaction.count} />
									</Flex>
								</Tab>
							</div>
						);
					})}
				</TabList>
			</div>
			{reactions.map((reaction) => (
				<ReactionView
					key={reaction.emojiId}
					reaction={reaction}
					selectedEmojiId={selectedEmoji.id}
					emojiProvider={emojiProvider}
				/>
			))}
		</Tabs>
	);
};
