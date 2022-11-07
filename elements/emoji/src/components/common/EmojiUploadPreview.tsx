/** @jsx jsx */
import { PureComponent } from 'react';
import { jsx } from '@emotion/react';
import AkButton from '@atlaskit/button/custom-theme-button';
import {
  FormattedMessage,
  injectIntl,
  WrappedComponentProps,
} from 'react-intl-next';
import { customCategory } from '../../util/constants';
import { EmojiDescription, Message } from '../../types';
import { messages } from '../i18n';
import Emoji from './Emoji';
import EmojiErrorMessage from './EmojiErrorMessage';
import { UploadStatus } from './internal-types';
import RetryableButton from './RetryableButton';
import {
  bigEmojiPreview,
  cancelButton,
  emojiPreviewErrorMessage,
  uploadAddRow,
  uploadPreview,
  uploadPreviewFooter,
  uploadPreviewText,
} from './styles';

export interface EmojiUploadPreviewProps {
  name: string;
  previewImage: string;
  uploadStatus?: UploadStatus;
  errorMessage?: Message;
  onUploadCancelled: () => void;
  onAddEmoji: () => void;
}

class EmojiUploadPreview extends PureComponent<
  EmojiUploadPreviewProps & WrappedComponentProps,
  {}
> {
  render() {
    const {
      name,
      previewImage,
      uploadStatus,
      errorMessage,
      onAddEmoji,
      onUploadCancelled,
      intl,
    } = this.props;
    const { formatMessage } = intl;

    let emojiComponent;

    if (previewImage) {
      const emoji: EmojiDescription = {
        shortName: `:${name}:`,
        type: customCategory,
        category: customCategory,
        representation: {
          imagePath: previewImage,
          width: 24,
          height: 24,
        },
        searchable: true,
      };

      emojiComponent = <Emoji emoji={emoji} />;
    }

    const uploading = uploadStatus === UploadStatus.Uploading;

    return (
      <div css={uploadPreviewFooter}>
        <div css={uploadPreview}>
          <div css={uploadPreviewText}>
            <h5>
              <FormattedMessage {...messages.emojiPreviewTitle} />
            </h5>
            <FormattedMessage
              {...messages.emojiPreview}
              values={{ emoji: emojiComponent }}
            />
          </div>
          <div css={bigEmojiPreview}>{emojiComponent}</div>
        </div>
        <div css={uploadAddRow}>
          {!uploading && errorMessage ? (
            <EmojiErrorMessage
              messageStyles={emojiPreviewErrorMessage}
              message={errorMessage}
              tooltip
            />
          ) : null}
          <RetryableButton
            label={formatMessage(messages.addEmojiLabel)}
            onSubmit={onAddEmoji}
            appearance="primary"
            loading={uploading}
            error={!!errorMessage}
          />
          <AkButton
            onClick={onUploadCancelled}
            appearance="subtle"
            isDisabled={uploading}
            css={cancelButton}
            testId="cancel-upload-button"
          >
            <FormattedMessage {...messages.cancelLabel} />
          </AkButton>
        </div>
      </div>
    );
  }
}

export default injectIntl(EmojiUploadPreview);
