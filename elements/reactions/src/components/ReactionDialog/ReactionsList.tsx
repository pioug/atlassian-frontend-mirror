/** @jsx   jsx */
import { useCallback, useState } from 'react';
import { jsx } from '@emotion/react';
import { type UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { ResourcedEmoji } from '@atlaskit/emoji/element';
import { type EmojiProvider } from '@atlaskit/emoji/resource';
import Tabs, { Tab, TabList } from '@atlaskit/tabs';
import { useThemeObserver } from '@atlaskit/tokens';
import { type SelectedType } from '@atlaskit/tabs/types';

import { type onDialogSelectReactionChange, type ReactionSummary } from '../../types';
import { Counter } from '../Counter';

import { counterStyle, customTabWrapper, customTabListStyles } from './styles';
import { ReactionView } from './ReactionView';

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
      index: reactions.findIndex(
        (reaction) => reaction.emojiId === initialEmojiId,
      ),
      id: initialEmojiId,
    };
  });
  const { colorMode } = useThemeObserver();

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
    <Tabs
      id="reactions-dialog-tabs"
      onChange={onTabChange}
      selected={selectedEmoji.index}
    >
      <div css={customTabListStyles} id="reactions-dialog-tabs-list">
        <TabList>
          {reactions.map((reaction) => {
            const emojiId = { id: reaction.emojiId, shortName: '' };

            return (
              <div
                css={customTabWrapper(
                  emojiId?.id === selectedEmoji.id,
                  selectedEmoji.id,
                  colorMode,
                )}
                className="reaction-elements"
                key={reaction.emojiId}
                data-testid={emojiId?.id}
              >
                <Tab>
                  <ResourcedEmoji
                    emojiProvider={emojiProvider}
                    emojiId={emojiId}
                    fitToHeight={16}
                    showTooltip
                  />
                  <div css={counterStyle(emojiId?.id === selectedEmoji.id)}>
                    <Counter value={reaction.count} />
                  </div>
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
