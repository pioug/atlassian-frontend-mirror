import React from 'react';
import { Component } from 'react';

import { CardAction } from '../../actions';
import { Wrapper } from './styled';
import {
  CardActionIconButton,
  CardActionIconButtonProps,
} from './cardActionIconButton';
import { CardActionsDropdownMenu } from './cardActionsDropdownMenu';
import { PreventClickThrough } from '../preventClickThrough';
import { createAndFireMediaEvent } from '../analytics';
import {
  withAnalyticsEvents,
  WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';

type CardActionIconButtonPropsWithAnalytics = CardActionIconButtonProps &
  WithAnalyticsEventsProps;
const CardActionIconButtonWithProps = (
  props: CardActionIconButtonPropsWithAnalytics,
) => <CardActionIconButton {...props} />;

export interface CardActionsViewProps {
  readonly actions: CardAction[];

  readonly onToggle?: (attrs: { isOpen: boolean }) => void;
  readonly triggerColor?: string;
}

export class CardActionsView extends Component<CardActionsViewProps> {
  render(): JSX.Element | null {
    const { actions } = this.props;

    if (!actions.length) {
      return null;
    }

    const primaryAction = actions.find(actionWithIcon);
    const otherActions = actions.filter(actionNotEqualTo(primaryAction));

    return (
      <PreventClickThrough>
        <Wrapper>
          {primaryAction
            ? this.renderActionIconButton(primaryAction, true)
            : null}
          {this.renderOtherActionButtons(otherActions)}
        </Wrapper>
      </PreventClickThrough>
    );
  }

  private renderActionIconButton(
    action: CardAction,
    isPrimary?: boolean,
  ): JSX.Element {
    const { triggerColor } = this.props;
    const { icon, handler, label } = action;
    const CardActionIconButtonWithAnalytics = withAnalyticsEvents({
      onClick: createAndFireMediaEvent({
        eventType: 'ui',
        action: 'clicked',
        actionSubject: 'button',
        actionSubjectId: isPrimary
          ? 'mediaCardPrimaryActionButton'
          : 'mediaCardSecondaryActionButton',
        attributes: {
          label,
        },
      }),
    })(CardActionIconButtonWithProps);
    return (
      <CardActionIconButtonWithAnalytics
        icon={icon}
        triggerColor={triggerColor}
        onClick={() => handler()}
      />
    );
  }

  private renderOtherActionButtons(actions: CardAction[]): JSX.Element | null {
    if (actions.length === 0) {
      return null;
    } else {
      const { triggerColor, onToggle } = this.props;
      const firstActionWithIcon = actions.find(actionWithIcon);
      const otherActions = actions.filter(
        actionNotEqualTo(firstActionWithIcon),
      );

      if (firstActionWithIcon && otherActions.length === 0) {
        return this.renderActionIconButton(firstActionWithIcon, false);
      } else {
        return (
          <CardActionsDropdownMenu
            actions={actions}
            triggerColor={triggerColor}
            onOpenChange={onToggle}
          />
        );
      }
    }
  }
}

function actionWithIcon(action: CardAction): boolean {
  return !!action.icon;
}

function actionNotEqualTo(otherAction?: CardAction) {
  return (action: any) => action !== otherAction;
}
