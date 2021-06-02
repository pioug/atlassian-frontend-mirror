import AkButton from '@atlaskit/button/custom-theme-button';
import React from 'react';
import { PureComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import { customCategory } from '../../util/constants';
import { EmojiDescription, Message } from '../../types';
import { messages } from '../i18n';
import Emoji from './Emoji';
import EmojiErrorMessage from './EmojiErrorMessage';
import { UploadStatus } from './internal-types';
import RetryableButton from './RetryableButton';
import * as styles from './styles';

export interface EmojiUploadPreviewProps {
  name: string;
  previewImage: string;
  uploadStatus?: UploadStatus;
  errorMessage?: Message;
  onUploadCancelled: () => void;
  onAddEmoji: () => void;
}

export default class EmojiUploadPreview extends PureComponent<
  EmojiUploadPreviewProps,
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
    } = this.props;

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
      <div className={styles.uploadPreviewFooter}>
        <div className={styles.uploadPreview}>
          <div className={styles.uploadPreviewText}>
            <h5>
              <FormattedMessage {...messages.emojiPreviewTitle} />
            </h5>
            <FormattedMessage
              {...messages.emojiPreview}
              values={{ emoji: emojiComponent }}
            />
          </div>
          <div className={styles.bigEmojiPreview}>{emojiComponent}</div>
        </div>
        <div className={styles.uploadAddRow}>
          {!uploading && errorMessage ? (
            <EmojiErrorMessage
              className={styles.emojiPreviewErrorMessage}
              message={errorMessage}
              tooltip
            />
          ) : null}
          <FormattedMessage {...messages.addEmojiLabel}>
            {(label) => (
              <RetryableButton
                className={styles.uploadEmojiButton}
                retryClassName={styles.uploadRetryButton}
                label={label as string}
                onSubmit={onAddEmoji}
                appearance="primary"
                loading={uploading}
                error={!!errorMessage}
              />
            )}
          </FormattedMessage>
          <AkButton
            onClick={onUploadCancelled}
            appearance="subtle"
            isDisabled={uploading}
            className={styles.cancelButton}
          >
            <FormattedMessage {...messages.cancelLabel} />
          </AkButton>
        </div>
      </div>
    );
  }
}
