import React from 'react';

import { useIntl } from 'react-intl-next';

import Button from '@atlaskit/button/custom-theme-button';
import DropdownMenu, {
  DropdownItem,
  DropdownItemGroup,
} from '@atlaskit/dropdown-menu';
import MoreIcon from '@atlaskit/icon/glyph/more';

import messages from '../../messages';
import { OverflowActionButtonsWrapper } from '../../styled/Card';
import { ProfileCardAction } from '../../types';

type OverflowButtonsProps = {
  actions: ProfileCardAction[];
  onItemClick: (
    action: ProfileCardAction,
    args: any,
    event: React.MouseEvent | React.KeyboardEvent,
  ) => void;
};

export const OverflowProfileCardButtons = (props: OverflowButtonsProps) => {
  const intl = useIntl();

  return (
    <OverflowActionButtonsWrapper>
      <DropdownMenu
        placement={'bottom-end'}
        trigger={({ triggerRef, isSelected, testId, ...providedProps }) => (
          <Button
            type="button"
            {...providedProps}
            ref={triggerRef}
            iconBefore={
              <MoreIcon
                label={intl.formatMessage(messages.profileCardMoreIconLabel)}
              />
            }
          />
        )}
      >
        <DropdownItemGroup>
          {props.actions.map((action) => (
            <DropdownItem
              key={action.id}
              onClick={(event, ...args: any) => {
                props.onItemClick(action, args, event);
              }}
              href={action.link}
            >
              {action.label}
            </DropdownItem>
          ))}
        </DropdownItemGroup>
      </DropdownMenu>
    </OverflowActionButtonsWrapper>
  );
};
