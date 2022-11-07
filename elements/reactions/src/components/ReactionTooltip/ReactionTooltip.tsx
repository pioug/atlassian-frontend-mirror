/** @jsx jsx */
import React from 'react';
import { jsx } from '@emotion/react';
import Tooltip from '@atlaskit/tooltip';
import { FormattedMessage } from 'react-intl-next';
import { ReactionSummary } from '../../types';
import { constants, i18n } from '../../shared';
import * as styles from './styles';

/**
 * Test id for wrapper ReactionTooltip div
 */
export const RENDER_REACTIONTOOLTIP_TESTID = 'render-reactionTooltip';

export interface ReactionTooltipProps {
  /**
   * Optional name for the reaction emoji
   */
  emojiName?: string;
  /**
   * Info on the emoji reaction to render
   */
  reaction: ReactionSummary;
  /**
   * Optional Max users to show in the displayed tooltip (defaults to 5)
   */
  maxReactions?: number;
}

export const ReactionTooltip: React.FC<ReactionTooltipProps> = ({
  emojiName,
  children,
  maxReactions = constants.TOOLTIP_USERS_LIMIT,
  reaction: { users = [] },
}) => {
  /**
   * Render list of users in the tooltip box
   */
  const content =
    !users || users.length === 0 ? null : (
      <div css={styles.tooltipStyle}>
        <ul>
          {emojiName ? <li css={styles.emojiNameStyle}>{emojiName}</li> : null}
          {users.slice(0, maxReactions).map((user, index) => {
            return <li key={index}>{user.displayName}</li>;
          })}
          {/* If count of reactions higher then given threshold then render custom message */}
          {users.length > maxReactions ? (
            <li css={styles.footerStyle}>
              <FormattedMessage
                {...i18n.messages.otherUsers}
                values={{
                  count: users.length - maxReactions,
                }}
              />
            </li>
          ) : null}
        </ul>
      </div>
    );
  return (
    <Tooltip
      content={content}
      position="bottom"
      testId={RENDER_REACTIONTOOLTIP_TESTID}
    >
      {React.Children.only(children)}
    </Tooltip>
  );
};
