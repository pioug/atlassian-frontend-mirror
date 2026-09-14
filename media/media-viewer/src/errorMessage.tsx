import React from 'react';
import { type ReactNode } from 'react';

import { FormattedMessage, type MessageDescriptor, type WrappedComponentProps } from 'react-intl';

import { type WithAnalyticsEventsProps } from '@atlaskit/analytics-next/withAnalyticsEvents';
import { type FileState } from '@atlaskit/media-client';
import { type MediaTraceContext } from '@atlaskit/media-common';
import { messages as i18nMessages } from '@atlaskit/media-ui/messages';
import { fg } from '@atlaskit/platform-feature-flags/fg';

import {
	createLoadFailedEvent,
	type LoadFailedEventPayload,
} from './analytics/events/operational/loadFailed';
import {
	createPreviewTooLargeEvent,
	type PreviewTooLargeEventPayload,
} from './analytics/events/operational/previewTooLarge';
import {
	createPreviewUnsupportedEvent,
	type PreviewUnsupportedEventPayload,
} from './analytics/events/operational/previewUnsupported';
import { fireAnalytics } from './analytics/fireAnalytics';
import { failMediaFileUfoExperience, type UFOFailedEventPayload } from './analytics/ufoExperiences';
import { type FileStateFlags } from './components/types';
import { errorLoadingFile } from './error-images';
import type { PrimaryErrorReason, SecondaryErrorReason } from './errors';
import { getErrorMessageFromError } from './getErrorMessageFromError';
import { getPrimaryErrorReason } from './getPrimaryErrorReason';
import type { MediaViewerError } from './MediaViewerError';
import { ErrorMessageWrapper, ErrorImage } from './styleWrappers';

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

export class ErrorMessage extends React.Component<
	Props & WrappedComponentProps & WithAnalyticsEventsProps,
	{}
> {
	private getErrorInfo(): ErrorMessageInfo {
		const {
			intl: { formatMessage },
			error,
		} = this.props;
		// Non-ZIP archives (e.g. RAR, TAR, 7z) and image MIME types that no browser
		// can natively decode (e.g. HEIC/HEIF, PSD, TIFF) aren't load failures - the
		// browser-based viewer simply can't preview them. Show a dedicated
		// "Unsupported file format" heading instead of the generic
		// "Something went wrong" copy.
		if (
			getPrimaryErrorReason(error) === 'archiveviewer-not-zip' ||
			getPrimaryErrorReason(error) === 'imageviewer-unsupported-mime'
		) {
			return {
				icon: errorLoadingFileImage(formatMessage),
				messages: [i18nMessages.unsupported_file_format, i18nMessages.archive_format_not_supported],
			};
		}

		// Code/text files (in the main viewer or inside a ZIP archive) over the
		// CodeViewer's 10MB limit aren't a load failure - the file is simply too
		// large for this viewer to preview. Show a dedicated "File is too large to
		// preview" heading instead of the generic "Something went wrong" copy.
		if (ErrorMessage.isPreviewTooLarge(error) && fg('platform_media_too_large_preview_state')) {
			return {
				icon: errorLoadingFileImage(formatMessage),
				messages: [i18nMessages.file_too_large_to_preview, i18nMessages.file_too_large_description],
			};
		}

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

	componentDidMount(): void {
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

	// Error reasons that represent a format the browser-based viewer simply can't
	// preview (not a load failure). These are reported as the informational,
	// non-SLI `previewUnsupported` metric instead of `loadFailed`.
	private static readonly previewUnsupportedReasons: ReadonlyArray<PrimaryErrorReason> = [
		'unsupported',
		'imageviewer-unsupported-mime',
	];

	static isPreviewUnsupported(error: MediaViewerError): boolean {
		return ErrorMessage.previewUnsupportedReasons.includes(getPrimaryErrorReason(error));
	}

	// Error reasons that mean the file exceeds the size limit supported by the
	// browser-based viewer (not a load failure). These are reported as the
	// informational, non-SLI `previewTooLarge` metric instead of `loadFailed`.
	private static readonly previewTooLargeReasons: ReadonlyArray<PrimaryErrorReason> = [
		'codeviewer-file-size-exceeds',
		'archiveviewer-codeviewer-file-size-exceeds',
	];

	static isPreviewTooLarge(error: MediaViewerError): boolean {
		return ErrorMessage.previewTooLargeReasons.includes(getPrimaryErrorReason(error));
	}

	static getEventPayload(
		error: MediaViewerError,
		fileId: string,
		fileState?: FileState,
		traceContext?: MediaTraceContext,
	): PreviewUnsupportedEventPayload | PreviewTooLargeEventPayload | LoadFailedEventPayload {
		if (
			fileState &&
			ErrorMessage.isPreviewTooLarge(error) &&
			fg('platform_media_too_large_preview_state')
		) {
			return createPreviewTooLargeEvent(error, fileState);
		} else if (fileState && ErrorMessage.isPreviewUnsupported(error)) {
			// this is not an SLI (load failure), its just a useful metric for files
			// whose format the browser-based viewer can't preview.
			return createPreviewUnsupportedEvent(fileState);
		} else {
			return createLoadFailedEvent(fileId, error, fileState, traceContext);
		}
	}

	render(): React.JSX.Element {
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
