/** @jsx jsx */
import React from 'react';
import { jsx, css } from '@emotion/core';
import Tooltip from '@atlaskit/tooltip';
import { FormattedMessage } from 'react-intl-next';

import { token } from '@atlaskit/tokens';
import { N90 } from '@atlaskit/theme/colors';

import { ReactionSummary } from '../types/ReactionSummary';
import { messages } from './i18n';

const verticalMargin = 5;

const tooltipStyle = css({
  maxWidth: '150px',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  marginBottom: verticalMargin,

  ul: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
    textAlign: 'left',
  },
  li: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    marginTop: verticalMargin,
  },
});

const emojiNameStyle = css({
  textTransform: 'capitalize',
  color: token('color.text.inverse', N90),
  fontWeight: 600,
});

const footerStyle = css({
  color: token('color.text.inverse', N90),
  fontWeight: 300,
});

export interface Props {
  /**
   * Optional name for the reaction emoji
   */
  emojiName?: string;
  /**
   * Info on the emoji reaction to render
   */
  reaction: ReactionSummary;
}

const TOOLTIP_USERS_LIMIT = 5;

export const ReactionTooltip: React.FC<Props> = ({
  emojiName,
  children,
  reaction: { users },
}) => {
  const content =
    !users || users.length === 0 ? null : (
      <div css={tooltipStyle}>
        <ul>
          {emojiName ? <li css={emojiNameStyle}>{emojiName}</li> : null}
          {users.slice(0, TOOLTIP_USERS_LIMIT).map((user, index) => {
            return <li key={index}>{user.displayName}</li>;
          })}
          {users.length > TOOLTIP_USERS_LIMIT ? (
            <li css={footerStyle}>
              <FormattedMessage
                {...messages.otherUsers}
                values={{
                  count: users.length - TOOLTIP_USERS_LIMIT,
                }}
              />
            </li>
          ) : null}
        </ul>
      </div>
    );

  return (
    <Tooltip content={content} position="bottom">
      {React.Children.only(children)}
    </Tooltip>
  );
};
