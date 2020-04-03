import React from 'react';
import { B400, N500 } from '@atlaskit/theme/colors';
import LockIcon from '@atlaskit/icon/glyph/lock-filled';
import Button from '@atlaskit/button';
import { Frame } from '../Frame';
import { IconAndTitleLayout } from '../IconAndTitleLayout';
import { AKIconWrapper } from '../Icon';
import { messages } from '../../messages';
import { FormattedMessage } from 'react-intl';
import { ForbiddenWrapper } from './styled';

export interface InlineCardForbiddenViewProps {
  /** The url to display */
  url: string;
  /** The optional click handler */
  onClick?: React.EventHandler<React.MouseEvent | React.KeyboardEvent>;
  /** The optional handler for "Connect" button */
  onAuthorise?: () => void;
  /** A flag that determines whether the card is selected in edit mode. */
  isSelected?: boolean;
  /** A `testId` prop is provided for specified elements, which is a unique string that appears as a data attribute `data-testid` in the rendered code, serving as a hook for automated tests */
  testId?: string;
}

export class InlineCardForbiddenView extends React.Component<
  InlineCardForbiddenViewProps
> {
  handleRetry = (event: React.MouseEvent<HTMLElement>) => {
    const { onAuthorise } = this.props;
    event.preventDefault();
    event.stopPropagation();
    onAuthorise!();
  };

  render() {
    const { url, onClick, isSelected, onAuthorise, testId } = this.props;
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
              <LockIcon label="error" size="small" primaryColor={B400} />
            </AKIconWrapper>
          }
          title={url}
          titleColor={N500}
        />
        {!onAuthorise ? (
          ''
        ) : (
          <>
            <ForbiddenWrapper>
              {` - `}
              <FormattedMessage {...messages.invalid_permissions} />
              {` `}
            </ForbiddenWrapper>
            <Button spacing="none" appearance="link" onClick={this.handleRetry}>
              <FormattedMessage {...messages.try_another_account} />
            </Button>
          </>
        )}
      </Frame>
    );
  }
}
