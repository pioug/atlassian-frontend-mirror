import type { MessageDescriptor } from 'react-intl-next';

import { type EmojiProvider, supportsUploadFeature } from '../../api/EmojiResource';

import type { EmojiDescription, EmojiUpload } from '../../types';
import { uploadFailedEvent, uploadSucceededEvent } from '../../util/analytics';
import type { AnalyticsEventPayload } from '@atlaskit/analytics-next';

import { messages } from '../i18n';
import { ufoExperiences } from '../../util/analytics/ufoExperiences';
import { extractErrorInfo } from '../../util/analytics/analytics';

export const uploadEmoji = (
	upload: EmojiUpload,
	emojiProvider: EmojiProvider,
	errorSetter: (message: MessageDescriptor | undefined) => void,
	onSuccess: (emojiDescription: EmojiDescription) => void,
	fireAnalytics: (event: AnalyticsEventPayload) => void,
	retry: boolean,
) => {
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
