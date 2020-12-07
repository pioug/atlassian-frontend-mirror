import React from 'react';
import { Component } from 'react';
import { messages } from '@atlaskit/media-ui';
import { injectIntl, InjectedIntlProps } from 'react-intl';

import {
  ErrorPopup,
  ErrorIconWrapper,
  ErrorMessage,
  ErrorHint,
  ErrorButton,
} from './styles';

import { errorIcon } from '@atlaskit/media-ui/errorIcon';
import { EditorContainer } from '../styles';

export interface ErrorViewProps {
  readonly message: string;
  readonly onCancel: () => void;
  readonly onRetry?: () => void;
}

export class ErrorView extends Component<ErrorViewProps & InjectedIntlProps> {
  render(): JSX.Element {
    return (
      <EditorContainer>
        <ErrorPopup>
          <ErrorIconWrapper>{errorIcon}</ErrorIconWrapper>
          <ErrorMessage>{this.props.message}</ErrorMessage>
          <ErrorHint>{this.renderHint()}</ErrorHint>
          {this.renderTryAgainButton()}
          {this.renderCancelButton()}
        </ErrorPopup>
      </EditorContainer>
    );
  }

  private renderHint(): JSX.Element {
    const {
      onRetry,
      intl: { formatMessage },
    } = this.props;
    if (onRetry) {
      return <span>{formatMessage(messages.error_hint_retry)}</span>;
    }

    return <span>{formatMessage(messages.error_hint_critical)}</span>;
  }

  private renderTryAgainButton(): JSX.Element | null {
    const {
      onRetry,
      intl: { formatMessage },
    } = this.props;
    if (onRetry) {
      return (
        <ErrorButton appearance="primary" onClick={onRetry}>
          {formatMessage(messages.try_again)}
        </ErrorButton>
      );
    }

    return null;
  }

  private renderCancelButton(): JSX.Element {
    const {
      onCancel,
      onRetry,
      intl: { formatMessage },
    } = this.props;
    const message = onRetry ? messages.cancel : messages.close;
    return (
      <ErrorButton appearance="subtle" onClick={onCancel}>
        {formatMessage(message)}
      </ErrorButton>
    );
  }
}

export default injectIntl(ErrorView);
