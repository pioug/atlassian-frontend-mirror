/** @jsx jsx */
import { jsx } from '@emotion/core';
import AkButton from '@atlaskit/button/custom-theme-button';
import { Component } from 'react';
import {
  FormattedMessage,
  injectIntl,
  WrappedComponentProps,
} from 'react-intl-next';
import { EmojiDescription } from '../../types';
import { messages } from '../i18n';
import CachingEmoji from './CachingEmoji';
import EmojiErrorMessage from './EmojiErrorMessage';
import RetryableButton from './RetryableButton';
import {
  cancelButton,
  deleteFooter,
  deletePreview,
  deleteText,
  emojiDeleteErrorMessage,
  previewButtonGroup,
} from './styles';

export interface OnDeleteEmoji {
  (emoji: EmojiDescription): Promise<boolean>;
}

export interface Props {
  emoji: EmojiDescription;
  onDeleteEmoji: OnDeleteEmoji;
  onCloseDelete: () => void;
  errorMessage?: string;
}

export interface State {
  loading: boolean;
  error: boolean;
}

class EmojiDeletePreview extends Component<
  Props & WrappedComponentProps,
  State
> {
  constructor(props: Props & WrappedComponentProps) {
    super(props);
    this.state = {
      loading: false,
      error: false,
    };
  }

  UNSAFE_componentWillUpdate(nextProps: Props) {
    if (nextProps.emoji.id !== this.props.emoji.id) {
      this.setState({ error: false });
    }
  }

  private onSubmit = () => {
    const { emoji, onDeleteEmoji, onCloseDelete } = this.props;
    if (!this.state.loading) {
      this.setState({ loading: true });
      onDeleteEmoji(emoji).then((success) => {
        if (success) {
          onCloseDelete();
          return;
        }
        this.setState({
          loading: false,
          error: true,
        });
      });
    }
  };

  private onCancel = () => {
    this.props.onCloseDelete();
  };

  render() {
    const { emoji, intl } = this.props;
    const { loading, error } = this.state;
    const { formatMessage } = intl;

    return (
      <div css={deletePreview}>
        <div css={deleteText}>
          <h5>
            <FormattedMessage {...messages.deleteEmojiTitle} />
          </h5>
          <FormattedMessage
            {...messages.deleteEmojiDescription}
            values={{ emojiShortName: emoji.shortName }}
          />
        </div>
        <div css={deleteFooter}>
          <CachingEmoji emoji={emoji} />
          <div css={previewButtonGroup}>
            {error ? (
              !loading ? (
                <EmojiErrorMessage
                  message={formatMessage(messages.deleteEmojiFailed)}
                  messageStyles={emojiDeleteErrorMessage}
                  tooltip
                />
              ) : null
            ) : null}
            <RetryableButton
              label={formatMessage(messages.deleteEmojiLabel)}
              onSubmit={this.onSubmit}
              appearance="danger"
              loading={loading}
              error={error}
            />
            <AkButton
              appearance="subtle"
              onClick={this.onCancel}
              css={cancelButton}
            >
              <FormattedMessage {...messages.cancelLabel} />
            </AkButton>
          </div>
        </div>
      </div>
    );
  }
}

export default injectIntl(EmojiDeletePreview);
