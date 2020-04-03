import React from 'react';
import { R300 } from '@atlaskit/theme/colors';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import Button from '@atlaskit/button';
import { Frame } from '../Frame';
import { IconAndTitleLayout } from '../IconAndTitleLayout';
import { AKIconWrapper } from '../Icon';
import { messages } from '../../messages';
import { FormattedMessage } from 'react-intl';

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
}

export class InlineCardErroredView extends React.Component<
  InlineCardErroredViewProps
> {
  handleRetry = (event: React.MouseEvent<HTMLElement>) => {
    const { onRetry } = this.props;
    if (onRetry) {
      event.preventDefault();
      event.stopPropagation();
      onRetry();
    }
  };

  render() {
    const { url, message, onClick, onRetry, isSelected, testId } = this.props;
    return (
      <Frame
        testId={testId}
        link={url}
        onClick={onClick}
        isSelected={isSelected}
      >
        <IconAndTitleLayout
          icon={
            <AKIconWrapper>
              <ErrorIcon label="error" size="small" primaryColor={R300} />
            </AKIconWrapper>
          }
          title={url + ' - ' + message.trim()}
          titleColor={R300}
        />{' '}
        {onRetry && (
          <Button spacing="none" appearance="link" onClick={this.handleRetry}>
            <FormattedMessage {...messages.try_again} />
          </Button>
        )}
      </Frame>
    );
  }
}
