import React from 'react';
import { Component } from 'react';

import MoreIcon from '@atlaskit/icon/glyph/more';
import DropdownMenu, {
  DropdownItemGroup,
  DropdownItem,
} from '@atlaskit/dropdown-menu';

import { type CardAction } from '../../../actions';
import { type CardActionIconButtonVariant } from './styles';
import {
  withAnalyticsEvents,
  type WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';
import { createAndFireMediaCardEvent } from '../../../../utils/analytics';
import { CardActionButton } from './cardActionButton';

export type CardActionsDropdownMenuProps = {
  readonly actions: CardAction[];

  readonly triggerColor?: string;
  readonly triggerVariant?: CardActionIconButtonVariant;
  readonly onOpenChange?: (attrs: { isOpen: boolean }) => void;
};

const CardActionButtonWithAnalytics = withAnalyticsEvents({
  onClick: createAndFireMediaCardEvent({
    eventType: 'ui',
    action: 'clicked',
    actionSubject: 'button',
    actionSubjectId: 'mediaCardDropDownMenu',
    attributes: {},
  }),
})(CardActionButton);

type DropdownItemProps = any & WithAnalyticsEventsProps; // Trick applied due to the lack of props type of DropdownItem
const DropdownItemWithProps = (props: DropdownItemProps) => (
  <DropdownItem testId="media-card-actions-menu-item" {...props} />
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

export class CardActionsDropdownMenu extends Component<CardActionsDropdownMenuProps> {
  render(): JSX.Element | null {
    const { actions, triggerColor, onOpenChange, triggerVariant } = this.props;

    if (actions.length > 0) {
      return (
        <DropdownMenu
          testId="media-card-actions-menu"
          onOpenChange={onOpenChange}
          trigger={({ triggerRef, ...providedProps }) => (
            <CardActionButtonWithAnalytics
              variant={triggerVariant}
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
              style={{ color: triggerColor }}
              ref={triggerRef}
              {...providedProps}
            >
              <MoreIcon label="more" />
            </CardActionButtonWithAnalytics>
          )}
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
