/** @jsx jsx */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { jsx } from '@emotion/core';
import { useAnalyticsEvents } from '@atlaskit/analytics-next';
import { EmojiProvider, ResourcedEmoji, EmojiId } from '@atlaskit/emoji';
import { Analytics } from '../../analytics';
import {
  ReactionSummary,
  ReactionClick,
  ReactionMouseEnter,
} from '../../types';
import { Counter } from '../Counter';
import { FlashAnimation } from '../FlashAnimation';
import { ReactionTooltip } from '../ReactionTooltip';
import { utils } from '../../shared';
import * as styles from './styles';

/**
 * Test id for Reaction item wrapper div
 */
export const RENDER_REACTION_TESTID = 'render_reaction_wrapper';

export interface ReactionProps {
  /**
   * Data for the reaction
   */
  reaction: ReactionSummary;
  /**
   * Provider for loading emojis
   */
  emojiProvider: Promise<EmojiProvider>;
  /**
   * event handler when the emoji button is clicked
   */
  onClick: ReactionClick;
  /**
   * Optional wrapper reaction <button /> class name
   */
  className?: string;
  /**
   * Optional event when the mouse cursor hovers over the reaction
   */
  onMouseEnter?: ReactionMouseEnter;
  /**
   * Show custom animation or render as standard without animation (defaults to false)
   */
  flash?: boolean;
}

/**
 * Render an emoji reaction button
 */
export const Reaction: React.FC<ReactionProps> = ({
  emojiProvider,
  onClick,
  reaction,
  onMouseEnter,
  className,
  flash = false,
}) => {
  const emojiId: EmojiId = { id: reaction.emojiId, shortName: '' };
  const hoverStart = useRef<number>();
  const { createAnalyticsEvent } = useAnalyticsEvents();
  const [emojiName, setEmojiName] = useState<string>();

  // TODO: Extract the flow to a custom hook to retrieve emoji detailed description from an id using a custom hook. This will benefit a better optimization instead of the emojiProvider resolving everytime.
  // Also optimize in future version to fetch in batch several emojiIds
  useEffect(() => {
    (async () => {
      const emojiResource = await Promise.resolve(emojiProvider);
      const foundEmoji = await emojiResource.findByEmojiId({
        shortName: '',
        id: reaction.emojiId,
      });
      if (foundEmoji) {
        setEmojiName(foundEmoji.name);
      }
    })();
  }, [emojiProvider, reaction.emojiId]);

  const handleMouseUp = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      if (utils.isLeftClick(event)) {
        const { reacted, emojiId } = reaction;
        Analytics.createAndFireSafe(
          createAnalyticsEvent,
          Analytics.createReactionClickedEvent,
          !reacted,
          emojiId,
        );
        onClick(reaction.emojiId, event);
      }
    },
    [createAnalyticsEvent, reaction, onClick],
  );

  const handleMouseEnter = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      if (!reaction.users || !reaction.users.length) {
        hoverStart.current = Date.now();
      }
      Analytics.createAndFireSafe(
        createAnalyticsEvent,
        Analytics.createReactionHoveredEvent,
        hoverStart.current,
      );
      if (onMouseEnter) {
        onMouseEnter(reaction, event);
      }
    },
    [createAnalyticsEvent, reaction, onMouseEnter],
  );

  return (
    <ReactionTooltip emojiName={emojiName} reaction={reaction}>
      <button
        className={className}
        css={[styles.reactionStyle, reaction.reacted && styles.reactedStyle]}
        title={reaction.emojiId}
        type="button"
        data-testid={RENDER_REACTION_TESTID}
        onMouseUp={handleMouseUp}
        onMouseEnter={handleMouseEnter}
      >
        <FlashAnimation flash={flash} css={styles.flashStyle}>
          <div
            css={[
              styles.emojiStyle,
              reaction.count === 0 && { padding: '4px 2px 4px 10px' },
            ]}
          >
            <ResourcedEmoji
              emojiProvider={emojiProvider}
              emojiId={emojiId}
              fitToHeight={16}
            />
          </div>
          <Counter value={reaction.count} highlight={reaction.reacted} />
        </FlashAnimation>
      </button>
    </ReactionTooltip>
  );
};
