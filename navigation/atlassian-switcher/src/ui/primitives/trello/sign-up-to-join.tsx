import withAnalyticsEvents, {
  WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next/withAnalyticsEvents';
import React from 'react';
import { FormattedMessage, InjectedIntlProps, injectIntl } from 'react-intl';
import styled from 'styled-components';
import TRELLO_SIGN_UP_TO_JOIN_BANNER_SRC from '../../../assets/trello-sign-up-to-join-banner';
import {
  createAndFireNavigationEvent,
  SWITCHER_TRELLO_SIGN_UP_TO_JOIN_SUBJECT,
  UI_EVENT_TYPE,
  ViewedTracker,
} from '../../../common/utils/analytics';
import { getJoinUrl } from '../../../common/utils/environment';
import { AVAILABLE_PRODUCT_DATA_MAP } from '../../../common/utils/links';
import messages from '../../../common/utils/messages';
import { SwitcherProductType } from '../../../types';
import StyledComponentsButton from '../styled-components-button';
import trelloTheme from './trello-button-theme';

const SignUpToJoinContent = styled.div`
  justify-content: center;
  align-items: center;
  text-align: center;
  margin: 4px 0 12px 0;
`;

const SignUpToJoinImage = styled.img`
  border-radius: 3px;
  width: 100%;
`;

const SignUpToJoinHeading = styled.h3`
  margin-top: 16px;
  margin-bottom: 0;
`;

const SignUpToJoinBody = styled.p`
  margin-top: 12px;
  margin-bottom: 0;
  word-wrap: break-word;
`;

const SignUpToJoinButton = styled(StyledComponentsButton)`
  /* increase specificity to override default Button styles */
  && {
    margin-top: 12px;
  }
`;

export interface SignUpToJoinBannerProps {
  defaultSignupEmail: string;
  continueUrl: string;
  productType: SwitcherProductType;
  onSignUpClicked?: () => void;
}

const TrelloSignUpToJoinBanner = (
  props: SignUpToJoinBannerProps & InjectedIntlProps & WithAnalyticsEventsProps,
) => {
  const {
    intl,
    defaultSignupEmail,
    continueUrl,
    productType,
    onSignUpClicked,
  } = props;

  const productLabel =
    productType && (AVAILABLE_PRODUCT_DATA_MAP[productType].label as string);

  return (
    <React.Fragment>
      <ViewedTracker subject={SWITCHER_TRELLO_SIGN_UP_TO_JOIN_SUBJECT} />
      <SignUpToJoinContent>
        <SignUpToJoinImage
          src={TRELLO_SIGN_UP_TO_JOIN_BANNER_SRC}
          alt={intl.formatMessage(messages.signUpToJoinImageAltText)}
        />
        <SignUpToJoinHeading>
          <FormattedMessage
            {...messages.signUpToJoinHeader}
            values={{ productLabel }}
          />
        </SignUpToJoinHeading>
        <SignUpToJoinBody>
          <FormattedMessage
            {...messages.signUpToJoinBody}
            values={{ email: <b>{defaultSignupEmail}</b>, productLabel }}
          />
        </SignUpToJoinBody>
        <SignUpToJoinButton
          type="button"
          href={getJoinUrl(defaultSignupEmail, continueUrl, productType)}
          theme={trelloTheme}
          appearance="primary"
          target="_blank"
          rel="noreferrer"
          onClick={onSignUpClicked}
        >
          <FormattedMessage {...messages.signUpToJoinCTA} />
        </SignUpToJoinButton>
      </SignUpToJoinContent>
    </React.Fragment>
  );
};

export default withAnalyticsEvents({
  onSignUpClicked: createAndFireNavigationEvent({
    eventType: UI_EVENT_TYPE,
    action: 'clicked',
    actionSubject: SWITCHER_TRELLO_SIGN_UP_TO_JOIN_SUBJECT,
  }),
})(injectIntl(TrelloSignUpToJoinBanner));
