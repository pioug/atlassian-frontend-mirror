/** @jsx jsx */
import { Component } from 'react';
import { jsx } from '@emotion/react';
import {
  FormattedMessage,
  injectIntl,
  type WrappedComponentProps,
} from 'react-intl-next';
import AkButton from '@atlaskit/button/custom-theme-button';
import FocusLock from 'react-focus-lock';
import type { EmojiDescription } from '../../types';
import { messages } from '../i18n';
import CachingEmoji from './CachingEmoji';
import EmojiErrorMessage, {
  emojiErrorScreenreaderTestId,
} from './EmojiErrorMessage';
import RetryableButton from './RetryableButton';
import {
  cancelButton,
  deleteFooter,
  deletePreview,
  deleteText,
  emojiDeleteErrorMessage,
  headingH5,
  previewButtonGroup,
} from './styles';
import VisuallyHidden from '@atlaskit/visually-hidden';

export interface OnDeleteEmoji {
  (emoji: EmojiDescription): Promise<boolean>;
}

export const emojiDeletePreviewTestId = 'emoji-delete-preview';
const deleteEmojiLabelId = 'fabric.emoji.delete.label.id';

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
      <FocusLock noFocusGuards>
        <div css={deletePreview} data-testid={emojiDeletePreviewTestId}>
          <div css={deleteText}>
            <h2 css={headingH5}>
              <FormattedMessage {...messages.deleteEmojiTitle} />
            </h2>
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
              <VisuallyHidden id={deleteEmojiLabelId}>
                {formatMessage(messages.deleteEmojiLabel)}
              </VisuallyHidden>
              <RetryableButton
                label={formatMessage(messages.deleteEmojiLabel)}
                onSubmit={this.onSubmit}
                appearance="danger"
                loading={loading}
                error={error}
                ariaLabelledBy={`${emojiErrorScreenreaderTestId} ${deleteEmojiLabelId}`}
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
      </FocusLock>
    );
  }
}

export default injectIntl(EmojiDeletePreview);
