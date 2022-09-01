/** @jsx jsx */
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { jsx } from '@emotion/core';
import { useAnalyticsEvents } from '@atlaskit/analytics-next';
import Tooltip from '@atlaskit/tooltip';
import { FormattedMessage } from 'react-intl-next';
import { Analytics } from '../../analytics';
import {
  ReactionStatus,
  ReactionClick,
  ReactionSummary,
  ReactionSource,
} from '../../types';
import { i18n } from '../../shared';
import { Reaction } from '../Reaction';
import { ReactionPicker, ReactionPickerProps } from '../ReactionPicker';
import * as styles from './styles';
import { SelectorProps } from '../Selector';

/**
 * Test id for wrapper Reactions div
 */
export const RENDER_REACTIONS_TESTID = 'render-reactions';

/**
 * Test id for the tooltip
 */
export const RENDER_TOOLTIP_TESTID = 'render-tooltip';

export interface ReactionsProps
  extends Pick<ReactionPickerProps, 'allowAllEmojis' | 'emojiProvider'>,
    Pick<SelectorProps, 'pickerQuickReactionEmojiIds'> {
  /**
   * event handler to fetching the reactions
   */
  loadReaction: () => void;
  /**
   * Event callback when an emoji button is selected
   */
  onSelection: (emojiId: string) => void;
  /**
   * Optional list of reactions to render (defaults to empty list)
   */
  reactions?: ReactionSummary[];
  /**
   * Condition for the reaction list status while been fetched
   */
  status: ReactionStatus;
  /**
   * event handler when the emoji button is clicked
   */
  onReactionClick: ReactionClick;
  /**
   * Optional emoji reactions list to show custom animation or render as standard (key => emoji string "id", value => true/false to show custom animation)
   */
  flash?: Record<string, boolean>;
  /**
   * Optional event when the mouse cursor hovers over the reaction
   * @param emojiId hovered reaction emoji id
   */
  onReactionHover?: (emojiId: string) => void;
  /**
   * Optional error message to show when unable to display the reaction emoji
   */
  errorMessage?: string;
  /**
   * the container for reactions/ari in the page (attached to the "quickReactionEmojiIds" prop)
   */
  containerAri: string;
  /**
   * unique Atlassian identifier for an emoji (attached to the "quickReactionEmojiIds" prop)
   */
  ari: string;
  /**
   * quickReactionEmojiIds are emojis that will be shown in the the primary view even if the reaction count is zero
   */
  quickReactionEmojiIds?: string[];
}

/**
 * Renders list of reactions
 */
export const Reactions: React.FC<ReactionsProps> = React.memo(
  ({
    flash = {},
    status,
    errorMessage,
    loadReaction,
    quickReactionEmojiIds,
    containerAri,
    ari,
    pickerQuickReactionEmojiIds,
    onReactionHover,
    onSelection,
    reactions = [],
    emojiProvider,
    allowAllEmojis,
    onReactionClick,
  }) => {
    const { createAnalyticsEvent } = useAnalyticsEvents();

    let openTime = useRef<number>();
    let renderTime = useRef<number>();

    if (status !== ReactionStatus.ready) {
      renderTime.current = Date.now();
    }

    useEffect(() => {
      if (status === ReactionStatus.notLoaded) {
        loadReaction();
      }
    }, [status, loadReaction]);

    useEffect(() => {
      if (status === ReactionStatus.ready && renderTime.current) {
        Analytics.createAndFireSafe(
          createAnalyticsEvent,
          Analytics.createReactionsRenderedEvent,
          renderTime.current,
        );
        renderTime.current = undefined;
      }
    }, [createAnalyticsEvent, status]);

    /**
     * Get content of the tooltip
     */
    const getTooltip = () => {
      switch (status) {
        case ReactionStatus.error:
          return (
            errorMessage || (
              <FormattedMessage {...i18n.messages.unexpectedError} />
            )
          );
        case ReactionStatus.loading:
        case ReactionStatus.notLoaded:
          return <FormattedMessage {...i18n.messages.loadingReactions} />;
        default:
          return undefined;
      }
    };

    const handleReactionMouseEnter = (summary: ReactionSummary) => {
      if (onReactionHover) {
        onReactionHover(summary.emojiId);
      }
    };

    const handlePickerOpen = useCallback(() => {
      openTime.current = Date.now();
      Analytics.createAndFireSafe(
        createAnalyticsEvent,
        Analytics.createPickerButtonClickedEvent,
        reactions.length,
      );
    }, [createAnalyticsEvent, reactions]);

    const handleOnCancel = useCallback(() => {
      Analytics.createAndFireSafe(
        createAnalyticsEvent,
        Analytics.createPickerCancelledEvent,
        openTime.current,
      );
      openTime.current = undefined;
    }, [createAnalyticsEvent]);

    const handleOnMore = useCallback(() => {
      Analytics.createAndFireSafe(
        createAnalyticsEvent,
        Analytics.createPickerMoreClickedEvent,
        openTime.current,
      );
    }, [createAnalyticsEvent]);

    const handleOnSelection = useCallback(
      (emojiId: string, source: ReactionSource) => {
        Analytics.createAndFireSafe(
          createAnalyticsEvent,
          Analytics.createReactionSelectionEvent,
          source,
          emojiId,
          reactions.find((reaction) => reaction.emojiId === emojiId),
          openTime.current,
        );
        openTime.current = undefined;
        onSelection(emojiId);
      },
      [createAnalyticsEvent, onSelection, reactions],
    );

    /**
     * Get the reactions that we want to render are any reactions with a count greater than zero as well as any default emoji not already shown
     */
    const memorizedReactions = useMemo(() => {
      //
      /**
       * If reactions not empty, don't show quick reactions Pre defined emoji or if its empty => return the current list of reactions
       */
      if (reactions.length > 0 || !quickReactionEmojiIds) {
        return reactions;
      }

      // add any missing default reactions
      const items: ReactionSummary[] = quickReactionEmojiIds
        .filter(
          (emojiId) =>
            !reactions.some((reaction) => reaction.emojiId === emojiId),
        )
        .map((emojiId) => {
          return {
            ari,
            containerAri,
            emojiId,
            count: 0,
            reacted: false,
          };
        });
      return reactions.concat(items);
    }, [ari, containerAri, quickReactionEmojiIds, reactions]);

    return (
      <div css={styles.wrapperStyle} data-testid={RENDER_REACTIONS_TESTID}>
        {memorizedReactions.map((reaction) => (
          <Reaction
            key={reaction.emojiId}
            css={styles.reactionStyle}
            reaction={reaction}
            emojiProvider={emojiProvider}
            onClick={onReactionClick}
            onMouseEnter={handleReactionMouseEnter}
            flash={flash[reaction.emojiId]}
          />
        ))}
        <Tooltip testId={RENDER_TOOLTIP_TESTID} content={getTooltip()}>
          <ReactionPicker
            css={styles.reactionStyle}
            emojiProvider={emojiProvider}
            miniMode
            allowAllEmojis={allowAllEmojis}
            pickerQuickReactionEmojiIds={pickerQuickReactionEmojiIds}
            disabled={status !== ReactionStatus.ready}
            onSelection={handleOnSelection}
            onOpen={handlePickerOpen}
            onCancel={handleOnCancel}
            onShowMore={handleOnMore}
          />
        </Tooltip>
      </div>
    );
  },
);
