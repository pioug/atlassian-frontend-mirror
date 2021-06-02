import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import AkButton from '@atlaskit/button/custom-theme-button';
import DropboxIcon from '@atlaskit/icon/glyph/dropbox';
import GoogledriveIcon from '@atlaskit/icon/glyph/googledrive';
import { FormattedMessage } from 'react-intl';
import { messages } from '@atlaskit/media-ui';
import { startAuth } from '../../../../actions/startAuth';
import { ServiceAccountLink, ServiceName, State } from '../../../../domain';
import {
  ButtonWrapper,
  ConnectWrapper,
  IconWrapper,
  TextDescription,
  Title,
} from './styled';

const serviceDetails: {
  [serviceName: string]: { name: string; icon: JSX.Element };
} = {
  dropbox: {
    name: 'Dropbox',
    icon: <DropboxIcon label="dropbox" size="xlarge" />,
  },
  google: {
    name: 'Google Drive',
    icon: <GoogledriveIcon label="drive" size="xlarge" />,
  },
};

export interface AuthStateProps {
  readonly service: ServiceAccountLink;
}

export interface AuthDispatchProps {
  readonly onStartAuth: (serviceName: ServiceName) => void;
}

export type AuthProps = AuthStateProps & AuthDispatchProps;

/**
 * Routing class that displays view depending on situation.
 */
export class StatelessAuth extends Component<AuthProps> {
  render() {
    const { service } = this.props;
    const details = serviceDetails[service.name];

    if (!details) {
      return null;
    }

    const { name, icon } = details;

    return (
      <ConnectWrapper>
        <Title>
          <FormattedMessage {...messages.upload_file_from} values={{ name }} />
        </Title>
        <IconWrapper>{icon}</IconWrapper>
        <ButtonWrapper>
          <AkButton
            appearance="primary"
            className="connectBtn"
            onClick={this.onClick}
          >
            <FormattedMessage {...messages.connect_to} values={{ name }} />
          </AkButton>
        </ButtonWrapper>
        <TextDescription>
          <FormattedMessage
            {...messages.connect_account_description}
            values={{ name }}
          />
        </TextDescription>
      </ConnectWrapper>
    );
  }

  private onClick = () => this.props.onStartAuth(this.props.service.name);
}

export default connect<AuthStateProps, AuthDispatchProps, {}, State>(
  (state) => ({
    service: state.view.service,
  }),
  (dispatch) => ({
    onStartAuth: (serviceName: ServiceName) => dispatch(startAuth(serviceName)),
  }),
)(StatelessAuth);
