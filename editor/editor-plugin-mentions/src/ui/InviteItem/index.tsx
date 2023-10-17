/** @jsx jsx */
import type { MouseEvent, SyntheticEvent } from 'react';
import React, { useCallback, useEffect } from 'react';

import { jsx } from '@emotion/react';
import type { WrappedComponentProps } from 'react-intl-next';
import { FormattedMessage, injectIntl } from 'react-intl-next';

import AddIcon from '@atlaskit/icon/glyph/add';
import type { UserRole } from '@atlaskit/mention';
import type { MentionDescription } from '@atlaskit/mention/resource';
import { N300 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { messages } from '../../messages';

import {
  avatarStyle,
  capitalizedStyle,
  mentionItemSelectedStyle,
  mentionItemStyle,
  nameSectionStyle,
  rowStyle,
} from './styles';

interface OnMentionEvent {
  (mention: MentionDescription, event?: SyntheticEvent<any>): void;
}

export const INVITE_ITEM_DESCRIPTION = { id: 'invite-teammate' };

const leftClick = (event: MouseEvent<any>): boolean => {
  return (
    event.button === 0 &&
    !event.altKey &&
    !event.ctrlKey &&
    !event.metaKey &&
    !event.shiftKey
  );
};

interface Props {
  productName?: string;
  onMount?: () => void;
  onMouseEnter?: OnMentionEvent;
  onSelection?: OnMentionEvent;
  selected?: boolean;
  userRole?: UserRole;
}

const InviteItem = ({
  productName,
  onMount,
  onMouseEnter,
  onSelection,
  selected,
  userRole,
  intl,
}: Props & WrappedComponentProps) => {
  const onSelected = useCallback(
    (event: React.MouseEvent<any>) => {
      if (leftClick(event) && onSelection) {
        event.preventDefault();
        onSelection(INVITE_ITEM_DESCRIPTION, event);
      }
    },
    [onSelection],
  );

  const onItemMouseEnter = useCallback(
    (event: React.MouseEvent<any>) => {
      if (onMouseEnter) {
        onMouseEnter(INVITE_ITEM_DESCRIPTION, event);
      }
    },
    [onMouseEnter],
  );

  useEffect(() => {
    if (onMount) {
      onMount();
    }
  }, [onMount]);

  return (
    <div
      css={[mentionItemStyle, selected && mentionItemSelectedStyle]}
      onMouseDown={onSelected}
      onMouseEnter={onItemMouseEnter}
      data-id={INVITE_ITEM_DESCRIPTION.id}
    >
      <div css={rowStyle}>
        <span css={avatarStyle}>
          <AddIcon
            label={intl.formatMessage(messages.mentionsAddLabel)}
            primaryColor={token('color.icon.subtle', N300)}
          />
        </span>
        <div css={nameSectionStyle} data-testid="name-section">
          <FormattedMessage
            {...messages.inviteItemTitle}
            values={{
              userRole: userRole || 'basic',
              productName: (
                <span css={capitalizedStyle} data-testid="capitalized-message">
                  {productName}
                </span>
              ),
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default injectIntl(InviteItem);
