import { FormattedMessage } from 'react-intl';

import { EmojiProvider, supportsUploadFeature } from '../../api/EmojiResource';

import { EmojiDescription, EmojiUpload } from '../../types';
import { uploadFailedEvent, uploadSucceededEvent } from '../../util/analytics';
import { AnalyticsEventPayload } from '@atlaskit/analytics-next';

import { messages } from '../i18n';

export const uploadEmoji = (
  upload: EmojiUpload,
  emojiProvider: EmojiProvider,
  errorSetter: (
    message: FormattedMessage.MessageDescriptor | undefined,
  ) => void,
  onSuccess: (emojiDescription: EmojiDescription) => void,
  fireAnalytics: (event: AnalyticsEventPayload) => void,
) => {
  const startTime = Date.now();
  errorSetter(undefined);
  if (supportsUploadFeature(emojiProvider)) {
    emojiProvider
      .uploadCustomEmoji(upload)
      .then(emojiDescription => {
        fireAnalytics(
          uploadSucceededEvent({
            duration: Date.now() - startTime,
          }),
        );
        onSuccess(emojiDescription);
      })
      .catch(err => {
        errorSetter(messages.emojiUploadFailed);
        // eslint-disable-next-line no-console
        console.error('Unable to upload emoji', err);
        fireAnalytics(
          uploadFailedEvent({
            duration: Date.now() - startTime,
            reason: messages.emojiUploadFailed.defaultMessage,
          }),
        );
      });
  }
};
