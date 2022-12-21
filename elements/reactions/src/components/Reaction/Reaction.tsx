/** @jsx jsx */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl-next';
import { jsx } from '@emotion/react';
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
import { ReactionTooltip, ReactionTooltipProps } from '../ReactionTooltip';
import { i18n, utils } from '../../shared';
import * as styles from './styles';
import { ReactionFocused } from '../../types/reaction';

/**
 * Test id for Reaction item wrapper div
 */
export const RENDER_REACTION_TESTID = 'render_reaction_wrapper';

export interface ReactionProps
  extends Pick<ReactionTooltipProps, 'allowUserDialog'> {
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
   * Optional event when focused the reaction
   */
  onFocused?: ReactionFocused;
  /**
   * Show custom animation or render as standard without animation (defaults to false)
   */
  flash?: boolean;
  /**
   * Optional function when the user wants to see more users in a modal
   */
  handleUserListClick?: (emojiId: string) => void;
}

/**
 * Render an emoji reaction button
 */
export const Reaction: React.FC<ReactionProps> = ({
  emojiProvider,
  onClick,
  reaction,
  onMouseEnter = () => {},
  onFocused = () => {},
  className,
  flash = false,
  handleUserListClick = () => {},
  allowUserDialog,
}) => {
  const intl = useIntl();
  const hoverStart = useRef<number>();
  const focusStart = useRef<number>();
  const { createAnalyticsEvent } = useAnalyticsEvents();
  const [emojiName, setEmojiName] = useState<string>();
  const [isTooltipEnabled, setIsTooltipEnabled] = useState(true);

  const emojiId: EmojiId = { id: reaction.emojiId, shortName: '' };

  // TODO: Extract the flow to a custom hook to retrieve emoji detailed description from an id using a custom hook. This will benefit a better optimization instead of the emojiProvider resolving everytime.
  // Also optimize in future version to fetch in batch several emojiIds
  useEffect(() => {
    (async () => {
      const emojiResource = await Promise.resolve(emojiProvider);
      const foundEmoji = await emojiResource.findById(reaction.emojiId);
      if (foundEmoji) {
        setEmojiName(foundEmoji.name);
      }
    })();
  }, [emojiProvider, reaction.emojiId]);

  const handleClick = useCallback(
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
      setIsTooltipEnabled(true);
      if (!reaction.users || !reaction.users.length) {
        focusStart.current = Date.now();
      }
      Analytics.createAndFireSafe(
        createAnalyticsEvent,
        Analytics.createReactionHoveredEvent,
        focusStart.current,
      );
      onMouseEnter(reaction.emojiId, event);
    },
    [createAnalyticsEvent, reaction, onMouseEnter],
  );

  const handleFocused = useCallback(
    (event: React.FocusEvent<HTMLButtonElement>) => {
      event.preventDefault();
      setIsTooltipEnabled(true);
      if (!reaction.users || !reaction.users.length) {
        hoverStart.current = Date.now();
      }
      Analytics.createAndFireSafe(
        createAnalyticsEvent,
        Analytics.createReactionFocusedEvent,
        hoverStart.current,
      );
      onFocused(reaction.emojiId, event);
    },
    [createAnalyticsEvent, reaction, onFocused],
  );

  const handleOpenReactionsDialog = (emojiId: string) => {
    handleUserListClick(emojiId);
    setIsTooltipEnabled(false);
  };
  return (
    <ReactionTooltip
      emojiName={emojiName}
      reaction={reaction}
      handleUserListClick={handleOpenReactionsDialog}
      allowUserDialog={allowUserDialog}
      isEnabled={isTooltipEnabled}
    >
      <button
        className={className}
        css={[styles.reactionStyle, reaction.reacted && styles.reactedStyle]}
        aria-label={intl.formatMessage(i18n.messages.reactWithEmoji, {
          emoji: emojiName,
        })}
        type="button"
        data-emoji-id={reaction.emojiId}
        data-testid={RENDER_REACTION_TESTID}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onFocus={handleFocused}
        data-emoji-button-id={reaction.emojiId}
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
