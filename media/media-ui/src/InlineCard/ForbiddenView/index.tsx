import React from 'react';
import { R400, N500 } from '@atlaskit/theme/colors';
import LockIcon from '@atlaskit/icon/glyph/lock-filled';
import Button from '@atlaskit/button';
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

export interface InlineCardForbiddenViewProps {
  /** The url to display */
  url: string;
  /** The icon of the service (e.g. Dropbox/Asana/Google/etc) to display */
  icon?: React.ReactNode;
  /** The optional click handler */
  onClick?: React.EventHandler<React.MouseEvent | React.KeyboardEvent>;
  /** The optional handler for "Connect" button */
  onAuthorise?: () => void;
  /** A flag that determines whether the card is selected in edit mode. */
  isSelected?: boolean;
  /** A `testId` prop is provided for specified elements, which is a unique string that appears as a data attribute `data-testid` in the rendered code, serving as a hook for automated tests */
  testId?: string;
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
    onAuthorise!();
  };

  renderMessage = () => {
    const { onAuthorise, url } = this.props;
    const link = <LinkAppearance>{url}</LinkAppearance>;
    return !onAuthorise ? (
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
        >
          <FormattedMessage {...messages.invalid_permissions}>
            {formattedMessage => {
              return <>{formattedMessage}, </>;
            }}
          </FormattedMessage>
          <FormattedMessage {...messages.try_another_account}>
            {formattedMessage => {
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
