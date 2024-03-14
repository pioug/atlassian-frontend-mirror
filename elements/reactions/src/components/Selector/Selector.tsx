/** @jsx jsx */
import React, { useEffect, useRef, useState } from 'react';
import { jsx } from '@emotion/react';
import { EmojiId, OnEmojiEvent } from '@atlaskit/emoji/types';
import { EmojiProvider } from '@atlaskit/emoji/resource';
import Tooltip from '@atlaskit/tooltip';
import { DefaultReactions } from '../../shared/constants';
import { EmojiButton } from '../EmojiButton';
import { ShowMore } from '../ShowMore';
import { emojiStyle, revealStyle, selectorStyle } from './styles';

/**
 * Test id for wrapper Selector div
 */
export const RENDER_SELECTOR_TESTID = 'render-selector';

export interface SelectorProps {
  /**
   * Provider for loading emojis
   */
  emojiProvider: Promise<EmojiProvider>;
  /**
   * Event handler when an emoji gets selected
   */
  onSelection: OnEmojiEvent;
  /**
   * Enable/Disable selection of extra custom emoji beyond default list (defaults to false)
   */
  showMore?: boolean;
  /**
   * Optional event when extra custom emojis icon is selected
   */
  onMoreClick?: React.MouseEventHandler<HTMLElement>;
  /**
   * Optional emojis shown for user to select from when the reaction add button is clicked (defaults to pre-defined list of emojis {@link DefaultReactions})
   */
  pickerQuickReactionEmojiIds?: EmojiId[];
}

/**
 * Reactions picker panel part of the <ReactionPicker /> component
 */
export const Selector = ({
  emojiProvider,
  onMoreClick,
  onSelection,
  showMore,
  pickerQuickReactionEmojiIds = DefaultReactions,
}: SelectorProps) => {
  const [selection, setSelection] = useState<EmojiId>();
  /**
   * Collection of global DOM timeout ids when user selects emojis for animation display
   */
  const timeoutIds = useRef<Array<number>>([]);

  /**
   * Clear the timeouts for the selected emojis when the component unmounts
   */
  useEffect(() => {
    const timeoutValues = timeoutIds.current;
    return function cleanup() {
      timeoutValues.forEach(clearTimeout);
    };
  }, []);

  /**
   * event handler when an emoji gets selected
   * @param item selected emoji
   * @param description depth detail of the selected emoji
   * @param event Dom event data
   */
  const onSelected: OnEmojiEvent = (item, description, event) => {
    timeoutIds.current.push(
      window.setTimeout(() => {
        onSelection(item, description, event);
      }, 250),
    );
    setSelection(item);
  };

  /**
   * custom css styling for the emoji icon
   * @param index location of the emoji in the rendered list of items
   */
  const emojiStyleAnimation: (index: number) => React.CSSProperties = (
    index,
  ) => ({ animationDelay: `${index * 50}ms` });

  /**
   * Render the default emoji icon
   * @param emoji emoji item
   * @param index location of the emoji in the array
   */
  const renderEmoji = (emoji: EmojiId, index: number) => {
    return (
      <div
        key={emoji.id ?? emoji.shortName}
        className={emoji === selection ? 'selected' : undefined}
        css={[emojiStyle, revealStyle]}
        style={emojiStyleAnimation(index)}
        data-testid={RENDER_SELECTOR_TESTID}
      >
        <Tooltip content={emoji.shortName}>
          <EmojiButton
            emojiId={emoji}
            emojiProvider={emojiProvider}
            onClick={onSelected}
          />
        </Tooltip>
      </div>
    );
  };

  return (
    <div css={selectorStyle}>
      {pickerQuickReactionEmojiIds
        ? pickerQuickReactionEmojiIds.map(renderEmoji)
        : null}
      {/* CSS inline styles should not be used, move styles to an external CSS file */}
      {showMore ? (
        <ShowMore
          key="more"
          buttonStyle={revealStyle}
          style={{
            button: emojiStyleAnimation(DefaultReactions.length),
          }}
          onClick={onMoreClick}
        />
      ) : null}
    </div>
  );
};
