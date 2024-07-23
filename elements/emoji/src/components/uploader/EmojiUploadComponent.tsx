/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useState, memo, useEffect } from 'react';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { FormattedMessage, type MessageDescriptor } from 'react-intl-next';
import type { AnalyticsEventPayload, CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';

import type { EmojiUpload } from '../../types';
import { type EmojiProvider, supportsUploadFeature } from '../../api/EmojiResource';
import EmojiUploadPickerWithIntl from '../common/EmojiUploadPicker';
import { uploadEmoji } from '../common/UploadEmoji';
import {
	createAndFireEventInElementsChannel,
	selectedFileEvent,
	uploadCancelButton,
	uploadConfirmButton,
} from '../../util/analytics';
import { emojiUploadFooter, emojiUploadWidget } from './styles';
import { ufoExperiences } from '../../util/analytics/ufoExperiences';
import { messages } from '../i18n';

export interface UploadRefHandler {
	(ref: HTMLDivElement): void;
}

export interface Props {
	emojiProvider: EmojiProvider;
	onUploaderRef?: UploadRefHandler;
	createAnalyticsEvent?: CreateUIAnalyticsEvent;
}

const EmojiUploadComponent = (props: Props) => {
	const { emojiProvider, createAnalyticsEvent, onUploaderRef } = props;
	const [uploadErrorMessage, setUploadErrorMessage] = useState<MessageDescriptor>();

	useEffect(() => {
		if (supportsUploadFeature(emojiProvider)) {
			emojiProvider.prepareForUpload();
		}
	}, [emojiProvider]);

	useEffect(
		() => () => {
			ufoExperiences['emoji-uploaded'].abort({
				metadata: {
					source: 'EmojiUploadComponent',
					reason: 'unmount',
				},
			});
		},
		[],
	);

	const onUploadEmoji = async (
		upload: EmojiUpload,
		retry: boolean,
		onSuccessHandler?: () => void,
	) => {
		ufoExperiences['emoji-uploaded'].start();
		ufoExperiences['emoji-uploaded'].addMetadata({ retry });

		if (supportsUploadFeature(emojiProvider)) {
			fireAnalytics(uploadConfirmButton({ retry }));
			try {
				await emojiProvider.prepareForUpload();
				const errorSetter = (message?: MessageDescriptor) => {
					setUploadErrorMessage(message);
				};
				// internally handled error from upload callback
				uploadEmoji(
					upload,
					emojiProvider,
					errorSetter,
					onUploaded(onSuccessHandler),
					fireAnalytics,
					retry,
				);
			} catch (error) {
				// error from upload token generation
				const message =
					error instanceof Error ? error.message : 'Issue with generating upload token';
				ufoExperiences['emoji-uploaded'].failure({
					metadata: {
						source: 'EmojiUploadComponent',
						error: message,
					},
				});
				setUploadErrorMessage(messages.emojiUploadFailed);
			}
		}
	};

	const onUploaded = (onSuccessHandler?: () => void) => () => {
		setUploadErrorMessage(undefined);

		if (onSuccessHandler) {
			onSuccessHandler();
		}
	};

	const onFileChooserClicked = () => {
		fireAnalytics(selectedFileEvent());
	};

	const onUploadCancelled = () => {
		fireAnalytics(uploadCancelButton());
		onUploaded();
	};

	const fireAnalytics = (analyticsEvent: AnalyticsEventPayload) => {
		if (createAnalyticsEvent) {
			createAndFireEventInElementsChannel(analyticsEvent)(createAnalyticsEvent);
		}
	};

	return (
		// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		<div css={emojiUploadWidget} ref={onUploaderRef}>
			{/* eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766 */}
			<div css={emojiUploadFooter}>
				<EmojiUploadPickerWithIntl
					onFileChooserClicked={onFileChooserClicked}
					onUploadCancelled={onUploadCancelled}
					onUploadEmoji={onUploadEmoji}
					errorMessage={uploadErrorMessage ? <FormattedMessage {...uploadErrorMessage} /> : null}
				/>
			</div>
		</div>
	);
};

export default memo(EmojiUploadComponent);
