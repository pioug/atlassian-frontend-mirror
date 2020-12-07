import React from 'react';
import {
  WarningContainer,
  WarningHeading,
  WarningIconWrapper,
  WarningSuggestion,
} from '../warnings/styles';
import { messages } from '@atlaskit/media-ui/messages';
import { FormattedMessage } from 'react-intl';
import { errorIcon } from '@atlaskit/media-ui/errorIcon';
import Button from '@atlaskit/button/custom-theme-button';

interface NetworkErrorWarningProps {
  action: () => void;
}

class NetworkErrorWarning extends React.Component<NetworkErrorWarningProps> {
  render() {
    return (
      <WarningContainer>
        <WarningIconWrapper>{errorIcon}</WarningIconWrapper>
        <WarningHeading>
          <FormattedMessage {...messages.cant_retrieve_files} />
        </WarningHeading>
        <WarningSuggestion>
          <FormattedMessage {...messages.check_your_network} />
        </WarningSuggestion>
        <Button onClick={this.props.action}>
          <FormattedMessage {...messages.try_again} />
        </Button>
      </WarningContainer>
    );
  }
}

export default NetworkErrorWarning;
