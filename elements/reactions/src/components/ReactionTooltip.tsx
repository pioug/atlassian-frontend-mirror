/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import Tooltip from '@atlaskit/tooltip';
import React, { Fragment } from 'react';
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
  emojiName?: string;
  reaction: ReactionSummary;
  children: React.ReactNode;
}

const TOOLTIP_USERS_LIMIT = 5;

export const ReactionTooltip = ({
  emojiName,
  children,
  reaction: { users },
}: Props) => {
  if (!users || users.length === 0) {
    return <Fragment>{React.Children.only(children)}</Fragment>;
  }

  const content = (
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
