import AkButton from '@atlaskit/button/custom-theme-button';
import Spinner from '@atlaskit/spinner';
import React from 'react';
import { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { messages } from '../i18n';
import * as styles from './styles';

export interface Props {
  className: string;
  retryClassName: string;
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
      <span className={styles.buttonSpinner}>
        <Spinner />
      </span>
    );
  }

  renderRetry() {
    const { loading, retryClassName, onSubmit } = this.props;
    return loading ? (
      this.renderLoading()
    ) : (
      <FormattedMessage {...messages.retryLabel}>
        {(retryLabel) => (
          <AkButton
            className={retryClassName}
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
    const {
      loading,
      error,
      className,
      appearance,
      onSubmit,
      label,
    } = this.props;
    return error ? (
      this.renderRetry()
    ) : loading ? (
      this.renderLoading()
    ) : (
      <AkButton
        className={className}
        appearance={appearance as any}
        onClick={onSubmit}
      >
        {label}
      </AkButton>
    );
  }
}
