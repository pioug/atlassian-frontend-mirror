import React from 'react';

import AkButton from '@atlaskit/button/custom-theme-button';
import IconError from '@atlaskit/icon/glyph/cross-circle';

import { ErrorText, ErrorTitle, ErrorWrapper } from '../../styled/Error';
import { ProfileCardErrorType } from '../../types';

type Props = {
  reload?: () => void | undefined;
  errorType?: ProfileCardErrorType;
};

export default class ErrorMessage extends React.PureComponent<Props> {
  static defaultProps = {
    errorType: {
      reason: 'default',
    },
  };

  renderNotFound = () => (
    <ErrorTitle>The user is no longer available for the site</ErrorTitle>
  );

  renderDefault = () => (
    <ErrorTitle>
      Oops, looks like we’re having issues
      <br />
      {this.props.reload ? (
        <ErrorText>Try again and we’ll give it another shot</ErrorText>
      ) : null}
    </ErrorTitle>
  );

  renderRetryButton = () =>
    this.props.reload ? (
      <AkButton appearance="link" onClick={this.props.reload}>
        Try again
      </AkButton>
    ) : null;

  renderErrorContent() {
    const errorType: ProfileCardErrorType = this.props.errorType || {
      reason: 'default',
    };

    switch (errorType.reason) {
      case 'NotFound':
        return this.renderNotFound();

      default:
        return this.renderDefault();
    }
  }

  render() {
    return (
      <ErrorWrapper>
        <IconError label="icon error" size="xlarge" />
        {this.renderErrorContent()}
        {this.renderRetryButton()}
      </ErrorWrapper>
    );
  }
}
