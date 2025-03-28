import React from 'react';
import { type ReactNode } from 'react';
import {
	FormattedMessage,
	injectIntl,
	type MessageDescriptor,
	type WrappedComponentProps,
} from 'react-intl-next';
import { messages as i18nMessages } from '@atlaskit/media-ui';
import { type FileState } from '@atlaskit/media-client';
import { withAnalyticsEvents, type WithAnalyticsEventsProps } from '@atlaskit/analytics-next';
import { ErrorMessageWrapper, ErrorImage } from './styleWrappers';
import { errorLoadingFile } from './error-images';
import { fireAnalytics } from './analytics';
import {
	type PrimaryErrorReason,
	type SecondaryErrorReason,
	type MediaViewerError,
	getPrimaryErrorReason,
	getSecondaryErrorReason,
} from './errors';
import { createLoadFailedEvent } from './analytics/events/operational/loadFailed';
import { createPreviewUnsupportedEvent } from './analytics/events/operational/previewUnsupported';
import { failMediaFileUfoExperience, type UFOFailedEventPayload } from './analytics/ufoExperiences';
import { type FileStateFlags } from './components/types';
import { type MediaTraceContext } from '@atlaskit/media-common';

export type Props = Readonly<{
	error: MediaViewerError;
	supressAnalytics?: boolean;
	fileId: string;
	fileState?: FileState;
	children?: ReactNode;
	fileStateFlags?: FileStateFlags;
	traceContext?: MediaTraceContext;
}>;

export type FormatMessageFn = (messageDescriptor: MessageDescriptor) => string;

type ErrorMessageInfo = {
	icon: JSX.Element;
	messages: Array<MessageDescriptor>;
};

const errorLoadingFileImage = (formatMessage: FormatMessageFn) => (
	<ErrorImage src={errorLoadingFile} alt={formatMessage(i18nMessages.error_loading_file)} />
);

export const errorReasonToMessages: Array<
	[PrimaryErrorReason | SecondaryErrorReason, MessageDescriptor]
> = [
	['serverRateLimited', i18nMessages.might_be_a_hiccup],
	['invalidFileId', i18nMessages.item_not_found_in_list],
	['itemviewer-file-failed-processing-status', i18nMessages.image_format_invalid_error],
	['archiveviewer-read-binary', i18nMessages.zip_entry_load_fail],
	['archiveviewer-create-url', i18nMessages.zip_entry_load_fail],
	['archiveviewer-missing-name-src', i18nMessages.zip_entry_load_fail],
	['archiveviewer-encrypted-entry', i18nMessages.couldnt_generate_encrypted_entry_preview],
	['archiveviewer-codeviewer-file-size-exceeds', i18nMessages.couldnt_load_file],
	['codeviewer-file-size-exceeds', i18nMessages.couldnt_load_file],
];

export const getErrorMessageFromError = (
	error: MediaViewerError,
): MessageDescriptor | undefined => {
	const matchingRow = errorReasonToMessages.find(
		(row) => row[0] === getPrimaryErrorReason(error) || row[0] === getSecondaryErrorReason(error),
	);
	return matchingRow ? matchingRow[1] : undefined;
};

export class ErrorMessage extends React.Component<
	Props & WrappedComponentProps & WithAnalyticsEventsProps,
	{}
> {
	private getErrorInfo(): ErrorMessageInfo {
		const {
			intl: { formatMessage },
			error,
		} = this.props;
		const errorInfo = {
			icon: errorLoadingFileImage(formatMessage),
			messages: [i18nMessages.something_went_wrong, i18nMessages.couldnt_generate_preview],
		};
		const message = getErrorMessageFromError(error);
		if (message) {
			errorInfo.messages.push(message);
		}
		return errorInfo;
	}

	componentDidMount() {
		const { props } = this;
		const {
			supressAnalytics,
			error,
			fileState,
			fileId,
			traceContext,
			createAnalyticsEvent,
			fileStateFlags,
		} = props;
		if (supressAnalytics !== true) {
			const payload = ErrorMessage.getEventPayload(error, fileId, fileState, traceContext);
			fireAnalytics(payload, createAnalyticsEvent);
			const rawPayload: UFOFailedEventPayload & { status?: string } = {
				...payload?.attributes,
				fileStateFlags,
			};
			if (Object.keys(rawPayload).includes('status')) {
				delete rawPayload['status'];
			}
			const failMediaFileUfoExperiencePayload: UFOFailedEventPayload = rawPayload;
			failMediaFileUfoExperience(failMediaFileUfoExperiencePayload);
		}
	}

	static getEventPayload(
		error: MediaViewerError,
		fileId: string,
		fileState?: FileState,
		traceContext?: MediaTraceContext,
	) {
		if (fileState && getPrimaryErrorReason(error) === 'unsupported') {
			// this is not an SLI, its just a useful metric for unsupported
			return createPreviewUnsupportedEvent(fileState);
		} else {
			return createLoadFailedEvent(fileId, error, fileState, traceContext);
		}
	}

	render() {
		const errorInfo = this.getErrorInfo();

		return (
			<ErrorMessageWrapper data-testid="media-viewer-error">
				<div>
					{errorInfo.icon}
					{errorInfo.messages.map((formatMessage, i) => (
						// eslint-disable-next-line @atlaskit/design-system/use-primitives-text
						<p key={`p${i}`}>
							<FormattedMessage {...formatMessage} />
						</p>
					))}
				</div>
				{/** todo: resolve error tip UX BMPT-1214 */}
				{this.props.children}
			</ErrorMessageWrapper>
		);
	}
}

// @ts-ignore: [PIT-1685] Fails in post-office due to backwards incompatibility issue with React 18
const ErroMsg: React.ComponentType<Props & WithAnalyticsEventsProps> = withAnalyticsEvents()(
	injectIntl(ErrorMessage),
);
export default ErroMsg;
