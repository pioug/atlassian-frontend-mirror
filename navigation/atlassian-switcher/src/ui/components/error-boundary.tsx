import {
  AnalyticsEventPayload,
  UIAnalyticsEvent,
  WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';
// AFP-2532 TODO: Fix automatic suppressions below
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { gridSize } from '@atlaskit/theme';
import React, { Fragment } from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import styled, { css } from 'styled-components';
import TRELLO_ERROR_SRC from '../../assets/trello-error';
import UNVERIFIED_ERROR_SRC from '../../assets/unverified-error';
import {
  NAVIGATION_CHANNEL,
  OPERATIONAL_EVENT_TYPE,
  UI_EVENT_TYPE,
  withAnalyticsEvents,
} from '../../common/utils/analytics';
import { getLoginUrl } from '../../common/utils/environment';
import { errorToReason, Reason } from '../../common/utils/error-to-reason';
import { FETCH_ERROR_NAME } from '../../common/utils/fetch';
import messages from '../../common/utils/messages';
import { Product } from '../../types';
import FormattedMessage from '../primitives/formatted-message';
import { Appearance } from '../theme/types';
import StyledComponentsButton from '../primitives/styled-components-button';

const TRIGGER_SUBJECT = 'errorBoundary';
const ACTION_SUBJECT = 'rendered';
// This image is also used as the generic error message in Notifications

// https://bitbucket.org/atlassian/pf-home-ui/src/61c5702523da06c9440b865939b2457322efa9f9/src/components/GenericError/error.png?at=master
const ROBOTS_SRC =
  'https://home-static.us-east-1.prod.public.atl-paas.net/d138e521b9ef92669ae8d5c34874d91c.png';

const RobotsImg = styled.img`
  height: ${gridSize() * 25}px;
`;

const TrelloErrorImg = styled.img`
  height: 88px;
  width: 140px;
`;

const UnverifiedUserImage = styled.img`
  height: 150px;
`;

type WithAppearanceProps = { appearance?: Appearance };

const ErrorContent = styled.div<WithAppearanceProps>`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;

const ErrorHeading = styled.h3`
  margin-top: ${4 * gridSize()}px;
  max-width: 240px;
`;

const ErrorMessage = styled.p`
  margin-top: ${3 * gridSize()}px;
  max-width: 240px;
`;

const LoginButton = styled(StyledComponentsButton)`
  /* increase specificity to override default Button styles */
  && {
    margin-top: ${3 * gridSize()}px;
  }
`;

const styles = {
  trelloButton: {
    '> *': {
      color: '#7a869a',
      textDecoration: 'underline',
      /**
       * Forcing textTransform prop to be of type 'capitalize', otherwise it is resolved as string
       */
      textTransform: 'capitalize' as const,
    },
    ':hover': {
      backgroundColor: 'rgba(9,30,66,.08)',

      '> *': {
        color: '#172b4d',
      },
    },
  },
};

const ErrorBoundaryBox = styled.div<WithAppearanceProps>`
  display: flex;
  justify-content: center;
  flex-direction: column;
  text-align: center;

  ${(props) =>
    props.appearance === 'drawer'
      ? css`
          padding-top: ${16 * gridSize()}px;
          padding-right: ${8 * gridSize()}px;
        `
      : css`
          margin: ${6 * gridSize()}px 0;

          ${LoginButton} {
            align-self: stretch;
            justify-content: center;
          }
        `};
`;

interface ErrorBoundaryProps {
  product: Product;
  children: React.ReactNode;
  appearance?: Appearance;
  triggerSubject?: string;
  hideFallbackUI?: boolean;
  extraAnalyticProps?: object;
}

type ErrorBoundaryState = {
  hasError: boolean;
  reason?: Reason;
};

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps & InjectedIntlProps & WithAnalyticsEventsProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  fireOperationalEvent = (payload: AnalyticsEventPayload) => {
    if (this.props.createAnalyticsEvent) {
      this.props
        .createAnalyticsEvent({
          eventType: OPERATIONAL_EVENT_TYPE,
          actionSubject: this.props.triggerSubject || TRIGGER_SUBJECT,
          ...payload,
        })
        .fire(NAVIGATION_CHANNEL);
    }
  };

  componentDidCatch(error: any) {
    const reason = errorToReason(error);

    this.setState(
      {
        hasError: true,
        reason,
      },
      () => {
        this.fireOperationalEvent({
          action: ACTION_SUBJECT,
          attributes: {
            ...reason,
            ...this.props.extraAnalyticProps,
          },
        });
      },
    );
  }

  handleLogin = (
    _: React.MouseEvent<HTMLElement>,
    analyticsEvent: UIAnalyticsEvent,
  ) => {
    analyticsEvent
      .update({
        eventType: UI_EVENT_TYPE,
        actionSubjectId: 'login',
      })
      .fire(NAVIGATION_CHANNEL);

    if (this.props.product !== Product.TRELLO) {
      window.location.reload();
    }
  };

  renderErrorBody() {
    const { reason } = this.state;

    if (!reason) {
      return;
    }

    if (reason.name === FETCH_ERROR_NAME) {
      const isTrello = this.props.product === Product.TRELLO;

      if (reason.status === 401) {
        // Not authorised http error
        return (
          <Fragment>
            <ErrorMessage>
              <FormattedMessage {...messages.errorTextLoggedOut} />
            </ErrorMessage>
            {isTrello ? (
              <LoginButton
                css={styles.trelloButton}
                appearance="link"
                href={getLoginUrl(Product.TRELLO)}
                onClick={this.handleLogin}
              >
                <FormattedMessage {...messages.login} />
              </LoginButton>
            ) : (
              <LoginButton onClick={this.handleLogin}>
                <FormattedMessage {...messages.login} />
              </LoginButton>
            )}
          </Fragment>
        );
      }

      if (reason.status === 403) {
        return (
          <ErrorMessage>
            <FormattedMessage {...messages.errorTextUnverified} />
          </ErrorMessage>
        );
      }

      return (
        <ErrorMessage>
          <FormattedMessage {...messages.errorTextNetwork} />
        </ErrorMessage>
      );
    }

    // Default error message
    return (
      <ErrorMessage>
        <FormattedMessage {...messages.errorText} />
      </ErrorMessage>
    );
  }

  renderErrorHeading() {
    const { reason } = this.state;

    if (!reason) {
      return;
    }

    if (reason.name === FETCH_ERROR_NAME && reason.status === 401) {
      return <FormattedMessage {...messages.errorHeadingLoggedOut} />;
    }

    if (reason.name === FETCH_ERROR_NAME && reason.status === 403) {
      return <FormattedMessage {...messages.errorHeadingUnverified} />;
    }

    return <FormattedMessage {...messages.errorHeading} />;
  }

  renderErrorImage() {
    const { intl, product } = this.props;
    const { reason } = this.state;

    if (product === Product.TRELLO) {
      return (
        <TrelloErrorImg
          src={TRELLO_ERROR_SRC}
          alt={intl.formatMessage(messages.errorImageAltText)}
        />
      );
    }

    if (reason!.status === 403) {
      return (
        <UnverifiedUserImage
          src={UNVERIFIED_ERROR_SRC}
          alt={intl.formatMessage(messages.errorImageAltText)}
        />
      );
    }

    return (
      <RobotsImg
        src={ROBOTS_SRC}
        alt={intl.formatMessage(messages.errorImageAltText)}
      />
    );
  }

  render() {
    const { appearance, hideFallbackUI } = this.props;
    const { hasError } = this.state;

    if (hasError && hideFallbackUI) {
      return <></>;
    }

    if (hasError) {
      return (
        <ErrorBoundaryBox data-testid="error-boundary" appearance={appearance}>
          <ErrorContent appearance={appearance}>
            {this.renderErrorImage()}
            <ErrorHeading>{this.renderErrorHeading()}</ErrorHeading>
            {this.renderErrorBody()}
          </ErrorContent>
        </ErrorBoundaryBox>
      );
    }

    return this.props.children;
  }
}

export default withAnalyticsEvents()(injectIntl(ErrorBoundary));
