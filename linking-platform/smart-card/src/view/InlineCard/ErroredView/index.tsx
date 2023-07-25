import React from 'react';
import { R300 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import Button from '@atlaskit/button/custom-theme-button';
import { Frame } from '../Frame';
import { IconAndTitleLayout } from '../IconAndTitleLayout';
import { AKIconWrapper } from '../Icon';
import { messages } from '../../../messages';
import { FormattedMessage } from 'react-intl-next';
import { IconStyledButton, LowercaseAppearance } from '../styled';
export interface InlineCardErroredViewProps {
  /** The url to display */
  url: string;
  /** The error message to display */
  message: string;
  /** The optional click handler */
  onClick?: React.EventHandler<React.MouseEvent | React.KeyboardEvent>;
  /** What to do when a user clicks "Try again" button */
  onRetry?: () => void;
  /** A flag that determines whether the card is selected in edit mode. */
  isSelected?: boolean;
  /** A `testId` prop is provided for specified elements, which is a unique string that appears as a data attribute `data-testid` in the rendered code, serving as a hook for automated tests */
  testId?: string;
  /* Icon to be provided to show this error state */
  icon?: React.ReactNode;
}

export class InlineCardErroredView extends React.Component<InlineCardErroredViewProps> {
  handleRetry = (event: React.MouseEvent<HTMLElement>) => {
    const { onRetry } = this.props;
    if (onRetry) {
      event.preventDefault();
      event.stopPropagation();
      onRetry();
    }
  };

  renderRightSide = () => {
    const { onRetry, message } = this.props;
    return !onRetry ? (
      message
    ) : (
      <>
        {message}
        {', '}
        <Button
          spacing="none"
          appearance="subtle-link"
          component={IconStyledButton}
          onClick={this.handleRetry}
          role="button"
        >
          <FormattedMessage {...messages.try_again}>
            {(formattedMessage) => {
              return (
                <LowercaseAppearance>{formattedMessage}</LowercaseAppearance>
              );
            }}
          </FormattedMessage>
        </Button>
      </>
    );
  };

  render() {
    const {
      url,
      onClick,
      isSelected,
      testId = 'inline-card-errored-view',
      icon,
    } = this.props;
    return (
      <Frame testId={testId} isSelected={isSelected}>
        <IconAndTitleLayout
          icon={
            icon || (
              <AKIconWrapper>
                <ErrorIcon
                  label="error"
                  size="small"
                  primaryColor={token('color.icon.danger', R300)}
                  testId="errored-view-default-icon"
                />
              </AKIconWrapper>
            )
          }
          link={url}
          title={url}
          onClick={onClick}
          rightSide={this.renderRightSide()}
        />
      </Frame>
    );
  }
}
