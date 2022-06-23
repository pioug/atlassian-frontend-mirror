import { MessageDescriptor } from 'react-intl-next';

import { EmojiProvider, supportsUploadFeature } from '../../api/EmojiResource';

import { EmojiDescription, EmojiUpload } from '../../types';
import { uploadFailedEvent, uploadSucceededEvent } from '../../util/analytics';
import { AnalyticsEventPayload } from '@atlaskit/analytics-next';

import { messages } from '../i18n';
import { ufoExperiences } from '../../util/analytics/ufoExperiences';

export const uploadEmoji = (
  upload: EmojiUpload,
  emojiProvider: EmojiProvider,
  errorSetter: (message: MessageDescriptor | undefined) => void,
  onSuccess: (emojiDescription: EmojiDescription) => void,
  fireAnalytics: (event: AnalyticsEventPayload) => void,
) => {
  const startTime = Date.now();
  errorSetter(undefined);
  if (supportsUploadFeature(emojiProvider)) {
    ufoExperiences['emoji-uploaded'].start();
    emojiProvider
      .uploadCustomEmoji(upload)
      .then((emojiDescription) => {
        fireAnalytics(
          uploadSucceededEvent({
            duration: Date.now() - startTime,
          }),
        );
        onSuccess(emojiDescription);
        ufoExperiences['emoji-uploaded'].success();
      })
      .catch((err) => {
        errorSetter(messages.emojiUploadFailed);
        // eslint-disable-next-line no-console
        console.error('Unable to upload emoji', err);
        fireAnalytics(
          uploadFailedEvent({
            duration: Date.now() - startTime,
            reason: messages.emojiUploadFailed.defaultMessage,
          }),
        );
        ufoExperiences['emoji-uploaded'].failure({
          metadata: {
            source: 'UploadEmoji',
            error: err,
            data: {
              upload: { ...upload },
            },
          },
        });
      });
  }
};
