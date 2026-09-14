import type { MessageDescriptor } from 'react-intl';

import type { AnalyticsEventPayload } from '@atlaskit/analytics-next/AnalyticsEvent';

import type { EmojiProvider } from '../../api/EmojiResource';
import { supportsUploadFeature } from '../../api/supportsUploadFeature';
import type { EmojiDescription, EmojiUpload } from '../../types';
import { extractErrorInfo } from '../../util/analytics/extractErrorInfo';
import { ufoExperiences } from '../../util/analytics/ufoExperiences';
import { uploadFailedEvent } from '../../util/analytics/uploadFailedEvent';
import { uploadSucceededEvent } from '../../util/analytics/uploadSucceededEvent';
import { messages } from '../i18n';

export const uploadEmoji = (
	upload: EmojiUpload,
	emojiProvider: EmojiProvider,
	errorSetter: (message: MessageDescriptor | undefined) => void,
	onSuccess: (emojiDescription: EmojiDescription) => void,
	fireAnalytics: (event: AnalyticsEventPayload) => void,
	retry: boolean,
): void => {
	const startTime = Date.now();
	errorSetter(undefined);
	if (supportsUploadFeature(emojiProvider)) {
		ufoExperiences['emoji-uploaded'].start();
		emojiProvider
			.uploadCustomEmoji(upload, retry)
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
				const isTimeout = err instanceof Error && err.message === 'uploadCustomEmoji timed out';
				const errMsg = isTimeout ? messages.emojiUploadTimeout : messages.emojiUploadFailed;
				errorSetter(errMsg);

				// eslint-disable-next-line no-console
				console.error('Unable to upload emoji', err);
				fireAnalytics(
					uploadFailedEvent({
						duration: Date.now() - startTime,
						reason: errMsg.defaultMessage,
					}),
				);
				ufoExperiences['emoji-uploaded'].failure({
					metadata: {
						source: 'UploadEmoji',
						error: extractErrorInfo(err),
					},
				});
			});
	}
};
