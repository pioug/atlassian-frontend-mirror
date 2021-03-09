import React from 'react';
import { Component } from 'react';

import MoreIcon from '@atlaskit/icon/glyph/more';
import DropdownMenu, {
  DropdownItemGroup,
  DropdownItem,
} from '@atlaskit/dropdown-menu';

import { CardAction } from '../../actions';
import {
  CardActionButton,
  CardActionIconButtonVariant,
  CardActionButtonProps,
} from './styled';
import {
  withAnalyticsEvents,
  WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';
import { createAndFireMediaCardEvent } from '../analytics';

export type CardActionsDropdownMenuProps = {
  readonly actions: CardAction[];

  readonly triggerColor?: string;
  readonly triggerVariant?: CardActionIconButtonVariant;
  readonly onOpenChange?: (attrs: { isOpen: boolean }) => void;
};

type CardActionButtonWithAnalyticsProps = CardActionButtonProps &
  WithAnalyticsEventsProps;
const CardActionButtonWithProps = (
  props: CardActionButtonWithAnalyticsProps,
) => <CardActionButton {...props} />;

const CardActionButtonWithAnalytics = withAnalyticsEvents({
  onClick: createAndFireMediaCardEvent({
    eventType: 'ui',
    action: 'clicked',
    actionSubject: 'button',
    actionSubjectId: 'mediaCardDropDownMenu',
    attributes: {},
  }),
})(CardActionButtonWithProps);

type DropdownItemProps = any & WithAnalyticsEventsProps; // Trick applied due to the lack of props type of DropdownItem
const DropdownItemWithProps = (props: DropdownItemProps) => (
  <DropdownItem data-testid="media-card-actions-menu-item" {...props} />
);

const createDropdownItemWithAnalytics = (action: CardAction, index: number) => {
  const { label, handler } = action;
  const DropdownItemWithAnalytics = withAnalyticsEvents({
    onClick: createAndFireMediaCardEvent({
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
    const { actions, triggerColor, onOpenChange, triggerVariant } = this.props;

    if (actions.length > 0) {
      return (
        <DropdownMenu
          data-testid="media-card-actions-menu"
          onOpenChange={onOpenChange}
          trigger={
            <CardActionButtonWithAnalytics
              variant={triggerVariant}
              style={{ color: triggerColor }}
            >
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
