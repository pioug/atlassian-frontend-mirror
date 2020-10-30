import React from 'react';
import { injectIntl, InjectedIntlProps, FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import withAnalyticsEvents, {
  WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next/withAnalyticsEvents';
// AFP-2532 TODO: Fix automatic suppressions below
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { colors, gridSize } from '@atlaskit/theme';

import {
  UI_EVENT_TYPE,
  NAVIGATION_CHANNEL,
  SWITCHER_TRELLO_HAS_NEW_FRIENDS_DISMISS_SUBJECT,
  SWITCHER_TRELLO_HAS_NEW_FRIENDS_SUBJECT,
  ViewedTracker,
} from '../../../common/utils/analytics';
import messages from '../../../common/utils/messages';

import TRELLO_FRIENDS_ICON from '../../../assets/banner-icon';

const TRELLO_BANNER_KEY = 'trelloHasNewFriendsBannerDismissed';

const TrelloHasNewFriendsContent = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: left;
  text-align: left;

  border: solid 1px ${colors.N40A};
  border-radius: 3px;
  color: ${colors.N300};
  margin-top: 4px;
  margin-bottom: ${gridSize()}px;
  padding: ${gridSize() * 2}px;
  position: relative;
`;

const Heading = styled.div`
  font-weight: 600;
`;

const Body = styled.div`
  padding-top: ${gridSize()}px;
`;

const TrelloBannerImage = styled.img`
  width: 54px;
  height: 36px;
  position: absolute;
  right: 0;
  bottom: 0;
`;

const TrelloLinkButton = styled.div`
  color: ${colors.N800};
  cursor: pointer;
  text-decoration: underline;
  padding-top: ${gridSize()}px;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${colors.B100} inset;
  }
`;

class TrelloNewFriendsBanner extends React.Component<
  InjectedIntlProps & WithAnalyticsEventsProps
> {
  state = {
    bannerDismissed: true,
  };

  componentDidMount() {
    this.setState({
      bannerDismissed:
        localStorage.getItem(TRELLO_BANNER_KEY) === 'dismissed' || false,
    });
  }

  onDismissClicked = () => {
    this.setState({
      bannerDismissed: true,
    });
    localStorage.setItem(TRELLO_BANNER_KEY, 'dismissed');

    if (this.props.createAnalyticsEvent) {
      this.props
        .createAnalyticsEvent({
          eventType: UI_EVENT_TYPE,
          action: 'clicked',
          actionSubject: SWITCHER_TRELLO_HAS_NEW_FRIENDS_DISMISS_SUBJECT,
        })
        .fire(NAVIGATION_CHANNEL);
    }
  };

  render() {
    return this.state.bannerDismissed ? null : (
      <React.Fragment>
        <ViewedTracker subject={SWITCHER_TRELLO_HAS_NEW_FRIENDS_SUBJECT} />
        <TrelloHasNewFriendsContent>
          <Heading>
            <FormattedMessage {...messages.trelloHasNewFriendsHeading} />
          </Heading>
          <Body>
            <FormattedMessage {...messages.trelloHasNewFriendsBody} />
          </Body>
          <TrelloLinkButton tabIndex={0} onClick={this.onDismissClicked}>
            <FormattedMessage {...messages.trelloHasNewFriendsDismiss} />
          </TrelloLinkButton>
          <TrelloBannerImage src={TRELLO_FRIENDS_ICON} />
        </TrelloHasNewFriendsContent>
      </React.Fragment>
    );
  }
}

export default withAnalyticsEvents()(injectIntl(TrelloNewFriendsBanner));
