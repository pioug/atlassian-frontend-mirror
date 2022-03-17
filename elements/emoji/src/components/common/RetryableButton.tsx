/** @jsx jsx */
import { jsx } from '@emotion/core';
import AkButton from '@atlaskit/button/custom-theme-button';
import Spinner from '@atlaskit/spinner';
import { Component } from 'react';
import { FormattedMessage } from 'react-intl-next';
import { messages } from '../i18n';
import { buttonSpinner, uploadEmojiButton, uploadRetryButton } from './styles';

export interface Props {
  label: string;
  appearance: string;
  error: boolean;
  onSubmit: () => void;
  loading: boolean;
}

export default class RetryableButton extends Component<Props, {}> {
  constructor(props: Props) {
    super(props);
  }

  renderLoading() {
    return (
      <span css={buttonSpinner}>
        <Spinner />
      </span>
    );
  }

  renderRetry() {
    const { loading, onSubmit } = this.props;
    return loading ? (
      this.renderLoading()
    ) : (
      <FormattedMessage {...messages.retryLabel}>
        {(retryLabel) => (
          <AkButton
            css={uploadRetryButton}
            appearance="warning"
            onClick={onSubmit}
          >
            {retryLabel}
          </AkButton>
        )}
      </FormattedMessage>
    );
  }

  render() {
    const { loading, error, appearance, onSubmit, label } = this.props;
    return error ? (
      this.renderRetry()
    ) : loading ? (
      this.renderLoading()
    ) : (
      <AkButton
        css={uploadEmojiButton}
        appearance={appearance as any}
        onClick={onSubmit}
      >
        {label}
      </AkButton>
    );
  }
}
