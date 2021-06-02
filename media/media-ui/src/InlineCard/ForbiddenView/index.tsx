import React from 'react';
import { R400, N500 } from '@atlaskit/theme/colors';
import LockIcon from '@atlaskit/icon/glyph/lock-filled';
import Button from '@atlaskit/button/custom-theme-button';
import { Frame } from '../Frame';
import { IconAndTitleLayout } from '../IconAndTitleLayout';
import { AKIconWrapper } from '../Icon';
import { messages } from '../../messages';
import { FormattedMessage } from 'react-intl';
import {
  IconStyledButton,
  LowercaseAppearance,
  LinkAppearance,
} from '../styled';
import { RequestAccessContextProps } from '../../types';

export interface InlineCardForbiddenViewProps {
  /** The url to display */
  url: string;
  /** The icon of the service (e.g. Dropbox/Asana/Google/etc) to display */
  icon?: React.ReactNode;
  /** The name of the service (e.g. Jira/Confluence/Asana/etc) to display */
  context?: string;
  /** The optional click handler */
  onClick?: React.EventHandler<React.MouseEvent | React.KeyboardEvent>;
  /** The optional handler for "Connect" button */
  onAuthorise?: () => void;
  /** A flag that determines whether the card is selected in edit mode. */
  isSelected?: boolean;
  /** A `testId` prop is provided for specified elements, which is a unique string that appears as a data attribute `data-testid` in the rendered code, serving as a hook for automated tests */
  testId?: string;
  /* Describes additional metadata based on the type of access a user has to the link */
  requestAccessContext?: RequestAccessContextProps;
}

const FallbackForbiddenIcon = (
  <AKIconWrapper>
    <LockIcon label="error" size="small" primaryColor={R400} />
  </AKIconWrapper>
);

export class InlineCardForbiddenView extends React.Component<
  InlineCardForbiddenViewProps
> {
  handleRetry = (event: React.MouseEvent<HTMLElement>) => {
    const { onAuthorise } = this.props;
    event.preventDefault();
    event.stopPropagation();
    if (onAuthorise) {
      onAuthorise();
    } else {
      this.props?.requestAccessContext?.action?.promise();
    }
  };

  renderForbiddenAccessMessage = () => {
    if (this.props?.requestAccessContext?.callToActionMessageKey) {
      const { callToActionMessageKey } = this.props.requestAccessContext;
      return (
        <FormattedMessage
          {...messages[callToActionMessageKey]}
          values={{ context: this.props.context }}
        />
      );
    }
    return (
      <>
        <FormattedMessage {...messages.invalid_permissions}>
          {(formattedMessage) => {
            return <>{formattedMessage}, </>;
          }}
        </FormattedMessage>
        <FormattedMessage {...messages.try_another_account}>
          {(formattedMessage) => {
            return (
              <LowercaseAppearance>{formattedMessage}</LowercaseAppearance>
            );
          }}
        </FormattedMessage>
      </>
    );
  };

  renderMessage = () => {
    const { url, onAuthorise } = this.props;
    const link = <LinkAppearance>{url}</LinkAppearance>;
    const hasRequestAccessContextMessage = this.props?.requestAccessContext
      ?.callToActionMessageKey;
    return !onAuthorise && !hasRequestAccessContextMessage ? (
      link
    ) : (
      <>
        {link}
        {' - '}
        <Button
          spacing="none"
          appearance="subtle-link"
          onClick={this.handleRetry}
          component={IconStyledButton}
          testId="button-connect-other-account"
        >
          {this.renderForbiddenAccessMessage()}
        </Button>
      </>
    );
  };

  render() {
    const {
      url,
      icon,
      onClick,
      isSelected,
      testId = 'inline-card-forbidden-view',
    } = this.props;
    return (
      <Frame
        testId={testId}
        link={url}
        onClick={onClick}
        isSelected={isSelected}
      >
        <IconAndTitleLayout
          icon={icon ? icon : FallbackForbiddenIcon}
          title={this.renderMessage()}
          titleColor={N500}
        />
      </Frame>
    );
  }
}
