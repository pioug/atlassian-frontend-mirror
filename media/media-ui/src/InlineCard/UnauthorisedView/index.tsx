import React from 'react';
import { IconAndTitleLayout } from '../IconAndTitleLayout';
import Button from '@atlaskit/button';
import { Frame } from '../Frame';
import { B400, N500 } from '@atlaskit/theme/colors';
import { messages } from '../../messages';
import { FormattedMessage } from 'react-intl';
import LockIcon from '@atlaskit/icon/glyph/lock-filled';
import { AKIconWrapper } from '../Icon';
import { ForbiddenWrapper } from '../ForbiddenView/styled';

export interface InlineCardUnauthorizedViewProps {
  /** The url to display */
  url: string;
  /** The icon of the service (e.g. Dropbox/Asana/Google/etc) to display */
  icon?: string;
  /** The optional click handler */
  onClick?: React.EventHandler<React.MouseEvent | React.KeyboardEvent>;
  /** What to do when a user hit "Try another account" button */
  onAuthorise?: () => void;
  /** A flag that determines whether the card is selected in edit mode. */
  isSelected?: boolean;
  /** A `testId` prop is provided for specified elements, which is a unique string that appears as a data attribute `data-testid` in the rendered code, serving as a hook for automated tests */
  testId?: string;
}

const FallbackUnauthorizedIcon = (
  <AKIconWrapper>
    <LockIcon label="error" size="small" primaryColor={B400} />
  </AKIconWrapper>
);

export class InlineCardUnauthorizedView extends React.Component<
  InlineCardUnauthorizedViewProps
> {
  handleConnectAccount = (event: React.MouseEvent<HTMLElement>) => {
    const { onAuthorise } = this.props;
    event.preventDefault();
    event.stopPropagation();
    return onAuthorise!();
  };

  render() {
    const { url, icon, onClick, isSelected, onAuthorise, testId } = this.props;
    return (
      <Frame
        testId={testId}
        link={url}
        onClick={onClick}
        isSelected={isSelected}
      >
        <IconAndTitleLayout
          icon={icon ? icon : FallbackUnauthorizedIcon}
          title={url}
          titleColor={N500}
        />
        {!onAuthorise ? (
          <ForbiddenWrapper>
            {` \u2011 `}
            <FormattedMessage {...messages.invalid_permissions} />
            {` `}
          </ForbiddenWrapper>
        ) : (
          <>
            {` \u2011 `}
            <Button
              spacing="none"
              appearance="link"
              onClick={this.handleConnectAccount}
            >
              <FormattedMessage {...messages.connect_link_account} />
            </Button>
          </>
        )}
      </Frame>
    );
  }
}
