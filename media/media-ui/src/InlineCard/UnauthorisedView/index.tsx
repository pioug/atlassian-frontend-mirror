import Button from '@atlaskit/button';
import LockIcon from '@atlaskit/icon/glyph/lock-filled';
import { N500, R400 } from '@atlaskit/theme/colors';
import Tooltip from '@atlaskit/tooltip';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { messages } from '../../messages';
import { Frame } from '../Frame';
import { AKIconWrapper } from '../Icon';
import { IconAndTitleLayout } from '../IconAndTitleLayout';
import { IconStyledButton, NoLinkAppearance } from '../styled';

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
    <LockIcon label="error" size="small" primaryColor={R400} />
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

  renderMessage = () => {
    const { onAuthorise } = this.props;
    return !onAuthorise ? (
      <FormattedMessage {...messages.invalid_permissions} />
    ) : (
      <Button
        spacing="none"
        appearance="link"
        component={IconStyledButton}
        onClick={this.handleConnectAccount}
      >
        <FormattedMessage {...messages.invalid_permissions}>
          {formattedMessage => {
            return <NoLinkAppearance>{formattedMessage}. </NoLinkAppearance>;
          }}
        </FormattedMessage>
        <FormattedMessage {...messages.connect_link_account} />
      </Button>
    );
  };

  render() {
    const { url, icon, onClick, isSelected, testId } = this.props;
    return (
      <Frame
        testId={testId}
        link={url}
        onClick={onClick}
        isSelected={isSelected}
      >
        <Tooltip content={url} tag="span" delay={0}>
          <IconAndTitleLayout
            icon={icon ? icon : FallbackUnauthorizedIcon}
            title={this.renderMessage()}
            titleColor={N500}
          />
        </Tooltip>
      </Frame>
    );
  }
}
