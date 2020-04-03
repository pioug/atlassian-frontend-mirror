import React from 'react';
import { Component, HTMLAttributes } from 'react';

import MoreIcon from '@atlaskit/icon/glyph/more';
import DropdownMenu, {
  DropdownItemGroup,
  DropdownItem,
} from '@atlaskit/dropdown-menu';

import { CardAction } from '../../actions';
import { CardActionButton } from './styled';
import {
  withAnalyticsEvents,
  WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';
import { createAndFireMediaEvent } from '../analytics';

export type CardActionsDropdownMenuProps = {
  readonly actions: CardAction[];

  readonly triggerColor?: string;
  readonly onOpenChange?: (attrs: { isOpen: boolean }) => void;
};

type CardActionButtonProps = HTMLAttributes<HTMLDivElement> &
  WithAnalyticsEventsProps;
const CardActionButtonWithProps = (props: CardActionButtonProps) => (
  <CardActionButton {...props} />
);

const CardActionButtonWithAnalytics = withAnalyticsEvents({
  onClick: createAndFireMediaEvent({
    eventType: 'ui',
    action: 'clicked',
    actionSubject: 'button',
    actionSubjectId: 'mediaCardDropDownMenu',
  }),
})(CardActionButtonWithProps);

type DropdownItemProps = any & WithAnalyticsEventsProps; // Trick applied due to the lack of props type of DropdownItem
const DropdownItemWithProps = (props: DropdownItemProps) => (
  <DropdownItem data-testid="media-card-actions-menu-item" {...props} />
);

const createDropdownItemWithAnalytics = (action: CardAction, index: number) => {
  const { label, handler } = action;
  const DropdownItemWithAnalytics = withAnalyticsEvents({
    onClick: createAndFireMediaEvent({
      eventType: 'ui',
      action: 'clicked',
      actionSubject: 'button',
      actionSubjectId: 'mediaCardDropDownMenuItem',
      attributes: {
        label,
      },
    }),
  })(DropdownItemWithProps);

  return (
    <DropdownItemWithAnalytics key={index} onClick={handler}>
      {label}
    </DropdownItemWithAnalytics>
  );
};

export class CardActionsDropdownMenu extends Component<
  CardActionsDropdownMenuProps
> {
  render(): JSX.Element | null {
    const { actions, triggerColor, onOpenChange } = this.props;

    if (actions.length > 0) {
      return (
        <DropdownMenu
          data-testid="media-card-actions-menu"
          onOpenChange={onOpenChange}
          trigger={
            <CardActionButtonWithAnalytics style={{ color: triggerColor }}>
              <MoreIcon label="more" />
            </CardActionButtonWithAnalytics>
          }
        >
          <DropdownItemGroup>
            {actions.map(createDropdownItemWithAnalytics)}
          </DropdownItemGroup>
        </DropdownMenu>
      );
    } else {
      return null;
    }
  }
}
