import React from 'react';
import { Component } from 'react';

import { CardAction } from '../../actions';
import { Wrapper } from './styled';
import {
  CardActionIconButton,
  CardActionIconButtonProps,
} from './cardActionIconButton';
import { CardActionIconButtonVariant } from './styled';
import { CardActionsDropdownMenu } from './cardActionsDropdownMenu';
import { PreventClickThrough } from '../preventClickThrough';
import { createAndFireMediaCardEvent } from '../analytics';
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
  readonly variant?: CardActionIconButtonVariant;
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
    const { triggerColor, variant } = this.props;
    const { icon, handler, label } = action;
    const actionSubjectId = isPrimary
      ? 'mediaCardPrimaryActionButton'
      : 'mediaCardSecondaryActionButton';

    const CardActionIconButtonWithAnalytics = withAnalyticsEvents({
      onClick: createAndFireMediaCardEvent({
        eventType: 'ui',
        action: 'clicked',
        actionSubject: 'button',
        actionSubjectId,
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
        variant={variant}
      />
    );
  }

  private renderOtherActionButtons(actions: CardAction[]): JSX.Element | null {
    if (actions.length === 0) {
      return null;
    } else {
      const { triggerColor, onToggle, variant } = this.props;
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
            triggerVariant={variant}
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
