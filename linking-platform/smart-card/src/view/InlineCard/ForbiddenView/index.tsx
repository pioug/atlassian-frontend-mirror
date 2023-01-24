import React from 'react';
import { R400, N500 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import LockIcon from '@atlaskit/icon/glyph/lock-filled';
import Button from '@atlaskit/button/custom-theme-button';
import { Frame } from '../Frame';
import { IconAndTitleLayout } from '../IconAndTitleLayout';
import { AKIconWrapper } from '../Icon';
import { messages } from '../../../messages';
import { FormattedMessage } from 'react-intl-next';
import { IconStyledButton } from '../styled';
import { RequestAccessContextProps } from '../../types';
import Lozenge from '@atlaskit/lozenge';
import {
  LozengeWrapper,
  LozengeBlockWrapper,
} from '../IconAndTitleLayout/styled';

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
    <LockIcon
      label="error"
      size="small"
      primaryColor={token('color.icon.danger', R400)}
      testId="forbidden-view-fallback-icon"
    />
  </AKIconWrapper>
);

export class InlineCardForbiddenView extends React.Component<InlineCardForbiddenViewProps> {
  state = {
    hasRequestAccessContextMessage:
      !!this.props?.requestAccessContext?.callToActionMessageKey,
  };

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
            return <>{formattedMessage}</>;
          }}
        </FormattedMessage>
      </>
    );
  };

  renderRightSide = () => {
    const { onAuthorise } = this.props;

    if (this.state.hasRequestAccessContextMessage) {
      return (
        <Button
          spacing="none"
          appearance="subtle-link"
          onClick={this.handleRetry}
          component={IconStyledButton}
          testId="button-connect-other-account"
          role="button"
        >
          {this.renderForbiddenAccessMessage()}
        </Button>
      );
    }

    if (onAuthorise) {
      return (
        <LozengeBlockWrapper>
          <Button
            spacing="none"
            appearance="subtle-link"
            onClick={this.handleRetry}
            component={IconStyledButton}
            testId="button-connect-other-account"
            role="button"
          >
            <LozengeWrapper>
              <Lozenge appearance={'moved'}>
                {this.renderForbiddenAccessMessage()}
              </Lozenge>
            </LozengeWrapper>
          </Button>
        </LozengeBlockWrapper>
      );
    }

    return null;
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
      <Frame testId={testId} isSelected={isSelected}>
        <IconAndTitleLayout
          icon={icon ? icon : FallbackForbiddenIcon}
          link={url}
          title={url}
          onClick={onClick}
          titleColor={token('color.text.subtle', N500)}
          rightSide={this.renderRightSide()}
          rightSideSpacer={this.state.hasRequestAccessContextMessage}
        />
      </Frame>
    );
  }
}
