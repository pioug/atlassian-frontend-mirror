import React from 'react';
import FormattedMessage from './formatted-message';
import messages from '../../common/utils/messages';
import Button from '@atlaskit/button/custom-theme-button';
import { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import {
  NAVIGATION_CHANNEL,
  UI_EVENT_TYPE,
} from '../../common/utils/analytics';

type ManageButtonProps = {
  href: string;
};

export default class ManageButton extends React.Component<ManageButtonProps> {
  onClick = (
    _: React.MouseEvent<HTMLElement>,
    analyticsEvent: UIAnalyticsEvent,
  ) => {
    analyticsEvent
      .update({
        eventType: UI_EVENT_TYPE,
        actionSubjectId: 'manageListButton',
      })
      .fire(NAVIGATION_CHANNEL);
  };

  render() {
    const { href } = this.props;
    return (
      <Button href={href} onClick={this.onClick}>
        <FormattedMessage {...messages.manageList} />
      </Button>
    );
  }
}
