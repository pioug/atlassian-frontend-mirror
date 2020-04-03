import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';

import { ServiceAccountLink, State } from '../../../domain';
import FolderViewer from './folderView/folderView';
import Auth from './auth/auth';
import { Wrapper } from './styled';
import NetworkErrorWarning from '../warnings/networkError';

import { Container } from '../warnings/styles';
import { changeService } from '../../../../popup/actions';

export interface BrowserStateProps {
  readonly service: ServiceAccountLink;
  readonly hasError: boolean;
}

export interface BrowserDispatchProps {
  reloadService: (service: ServiceAccountLink) => void;
}

export type BrowserProps = BrowserStateProps & BrowserDispatchProps;

export class Browser extends Component<BrowserProps> {
  render(): JSX.Element {
    const { service, hasError } = this.props;
    const view = hasError ? (
      this.renderError()
    ) : service.accountId ? (
      <FolderViewer />
    ) : (
      <Auth />
    );

    return <Wrapper>{view}</Wrapper>;
  }

  private renderError = () => {
    return (
      <Container id="browser-container">
        <NetworkErrorWarning action={this.reloadService} />
      </Container>
    );
  };

  private reloadService = () => {
    const { reloadService, service } = this.props;

    reloadService(service);
  };
}

export default connect<BrowserStateProps, BrowserDispatchProps, {}, State>(
  ({ view: { service, hasError } }) => ({
    service,
    hasError,
  }),
  dispatch => ({
    reloadService: (service: ServiceAccountLink) =>
      dispatch(changeService(service.name)),
  }),
)(Browser);
