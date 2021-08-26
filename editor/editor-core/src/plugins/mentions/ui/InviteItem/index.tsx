import AddIcon from '@atlaskit/icon/glyph/add';
import { MentionDescription } from '@atlaskit/mention/resource';
import { UserRole } from '@atlaskit/mention';
import { N300 } from '@atlaskit/theme/colors';
import React, {
  useCallback,
  useEffect,
  MouseEvent,
  SyntheticEvent,
} from 'react';
import { FormattedMessage } from 'react-intl';
import {
  AvatarStyle,
  CapitalizedStyle,
  MentionItemStyle,
  NameSectionStyle,
  RowStyle,
  ROW_SIDE_PADDING,
  AVATAR_HEIGHT,
} from './styles';
import { messages } from '../../messages';

export interface OnMentionEvent {
  (mention: MentionDescription, event?: SyntheticEvent<any>): void;
}

export const INVITE_ITEM_MIN_HEIGHT = AVATAR_HEIGHT + ROW_SIDE_PADDING * 2;
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

export interface Props {
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
}: Props) => {
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
    <MentionItemStyle
      selected={selected}
      onMouseDown={onSelected}
      onMouseEnter={onItemMouseEnter}
      data-id={INVITE_ITEM_DESCRIPTION.id}
    >
      <RowStyle>
        <AvatarStyle>
          <AddIcon label="add-icon" primaryColor={N300} />
        </AvatarStyle>
        <NameSectionStyle>
          <FormattedMessage
            {...messages.inviteItemTitle}
            values={{
              userRole: userRole || 'basic',
              productName: <CapitalizedStyle>{productName}</CapitalizedStyle>,
            }}
          />
        </NameSectionStyle>
      </RowStyle>
    </MentionItemStyle>
  );
};

export default InviteItem;
