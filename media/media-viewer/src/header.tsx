import React, { useEffect, useRef, useState } from 'react';
import { type ReactNode, type ReactChild } from 'react';
import {
	type FileState,
	type ProcessingFileState,
	type Identifier,
	isExternalImageIdentifier,
	isErrorFileState,
	type ErrorFileState,
	type FileIdentifier,
	toCommonMediaClientError,
} from '@atlaskit/media-client';
import {
	hideControlsClassName,
	messages,
	toHumanReadableMediaSize,
	MediaButton,
} from '@atlaskit/media-ui';
import { getLanguageType, getExtension, isCodeViewerItem } from '@atlaskit/media-ui/codeViewer';
import { isZipMimeType } from '@atlaskit/media-common/isZipMimeType';
import { fg } from '@atlaskit/platform-feature-flags';
import { FormattedMessage, injectIntl, type WrappedComponentProps } from 'react-intl';
import { Outcome } from './domain';
import {
	Header as HeaderWrapper,
	LeftHeader,
	RightHeader,
	MetadataWrapper,
	MetadataSubText,
	MedatadataTextWrapper,
	MetadataIconWrapper,
	MetadataFileName,
	FormattedMessageWrapper,
} from './styleWrappers';
import { ToolbarDownloadButton, DisabledToolbarDownloadButton } from './download';
import { type MediaViewerExtensions } from './components/types';
import { useFileState, useMediaClient } from '@atlaskit/media-client-react';
import { type MediaFeatureFlags, type MediaTraceContext } from '@atlaskit/media-common';
import { MimeTypeIcon } from '@atlaskit/media-ui/mime-type-icon';
import { getFormat } from './viewers/codeViewer/util';
import { MediaViewerError } from './errors';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

export type Props = {
	readonly identifier: Identifier;
	readonly onClose?: () => void;
	readonly extensions?: MediaViewerExtensions;
	readonly onSidebarButtonClick?: () => void;
	readonly isSidebarVisible?: boolean;
	readonly featureFlags?: MediaFeatureFlags;
	readonly onSetArchiveSideBarVisible?: (isVisible: boolean) => void;
	readonly isArchiveSideBarVisible?: boolean;
	traceContext: MediaTraceContext;
	readonly fallbackMediaNameFetcher?: (id: string) => Promise<string>;
};

export const Header = ({
	isArchiveSideBarVisible = false,
	extensions,
	isSidebarVisible,
	onSidebarButtonClick,
	identifier,
	onClose,
	onSetArchiveSideBarVisible,
	traceContext,
	fallbackMediaNameFetcher,
}: Props & WrappedComponentProps): React.JSX.Element => {
	// States
	const [item, setItem] = useState<Outcome<FileState, MediaViewerError>>(Outcome.pending());
	const [fallbackMediaName, setFallbackMediaName] = useState<string | undefined>();
	const fallbackMediaNameFetchAttempted = useRef(false);
	const lastFetchedFileId = useRef<string | undefined>();

	// Refs and Hooks
	const mediaClient = useMediaClient();
	const { id, collectionName, occurrenceKey } = identifier as FileIdentifier;
	const { fileState } = useFileState(id, {
		collectionName,
		occurrenceKey,
	});

	const onSetArchiveSideBarVisibleRef = useRef(onSetArchiveSideBarVisible);
	onSetArchiveSideBarVisibleRef.current = onSetArchiveSideBarVisible;

	// previous values
	useEffect(() => {
		if (isExternalImageIdentifier(identifier)) {
			const { name = identifier.dataURI } = identifier;

			// Simulate a processing file state to render right metadata
			const fileState: ProcessingFileState = {
				status: 'processing',
				id: name,
				mediaType: 'image',
				mimeType: 'image/',
				name,
				representations: {},
				size: 0,
			};
			setItem(Outcome.successful(fileState));
			return;
		}

		if (!fileState) {
			return;
		}

		if (fileState.status !== 'error') {
			// Only reserve the archive sidebar space for previewable ZIP archives.
			// Non-ZIP archives (e.g. RAR, TAR, 7z) render a full-width "unsupported
			// file format" error in the body and have no sidebar, so the header
			// must not leave an empty 300px gap for them.
			onSetArchiveSideBarVisibleRef.current?.(
				!isErrorFileState(fileState) &&
					fileState.mediaType === 'archive' &&
					// When the zip guard is on, non-ZIP archives show a full-width
					// "unsupported file format" error with no sidebar, so the header
					// must not reserve the 300px sidebar space for them.
					(!fg('platform_media_archive_zip_guard') || isZipMimeType(fileState.mimeType)),
			);
			setItem(Outcome.successful(fileState));
		} else {
			setItem(
				Outcome.failed(
					new MediaViewerError('header-fetch-metadata', toCommonMediaClientError(fileState)),
				),
			);
		}
	}, [fileState, identifier]);

	useEffect(() => {
		// Reset fetch state when the file identity changes (e.g. navigating in viewer)
		const currentId = fileState?.status !== 'error' ? fileState?.id : undefined;
		if (
			currentId &&
			currentId !== lastFetchedFileId.current &&
			expValEquals('platform_editor_media_name_fallback_viewer_card', 'isEnabled', true)
		) {
			fallbackMediaNameFetchAttempted.current = false;
			setFallbackMediaName(undefined);
			lastFetchedFileId.current = currentId;
		}

		if (
			fileState &&
			fileState.status !== 'error' &&
			!fileState.name &&
			fallbackMediaNameFetcher &&
			!fallbackMediaNameFetchAttempted.current &&
			expValEquals('platform_editor_media_name_fallback_viewer_card', 'isEnabled', true)
		) {
			fallbackMediaNameFetchAttempted.current = true;
			fallbackMediaNameFetcher(fileState.id).then(
				(name) => {
					setFallbackMediaName(name);
				},
				() => {
					// Silently ignore fetch failures
				},
			);
		}
	}, [fileState, fallbackMediaNameFetcher]);

	const renderFileTypeText = (item: Exclude<FileState, ErrorFileState>): ReactNode => {
		// render appropriate header if its a code/email item and the feature flag is enabled
		if (isCodeViewerItem(item.name, item.mimeType)) {
			// gather language and extension
			// i.e test.py would have a language of 'python' and an extension of 'py'
			const language = getLanguageType(item.name, item.mimeType);
			const ext = getExtension(item.name);

			// specific cases for if we want a certain word translated in other languages
			switch (ext) {
				case 'msg':
					return <FormattedMessage {...messages.email} />;
				case 'txt':
					return <FormattedMessage {...messages.text} />;
			}

			// no need for translations in other languages
			return <>{getFormat(language || 'unknown', ext)}</>;
		}

		const { mediaType } = item;
		const mediaTypeTranslationMap = {
			doc: messages.document,
			audio: messages.audio,
			video: messages.video,
			image: messages.image,
			archive: messages.archive,
			unknown: messages.unknown,
		};
		const message = mediaTypeTranslationMap[mediaType || 'unknown'];

		// Defaulting to unknown again since backend has more mediaTypes than the current supported ones
		return <FormattedMessage {...(message || messages.unknown)} />;
	};

	return (
		<HeaderWrapper
			isArchiveSideBarVisible={isArchiveSideBarVisible}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className={hideControlsClassName}
		>
			<LeftHeader>
				{item.match({
					successful: (item) =>
						!isErrorFileState(item) && (
							<MetadataWrapper>
								<MetadataIconWrapper>
									<MimeTypeIcon
										testId={'media-viewer-file-type-icon'}
										mediaType={item.mediaType}
										mimeType={item.mimeType}
										name={item.name}
									/>
								</MetadataIconWrapper>
								<MedatadataTextWrapper>
									<MetadataFileName data-testid="media-viewer-file-name">
										{item.name ||
											(expValEquals(
												'platform_editor_media_name_fallback_viewer_card',
												'isEnabled',
												true,
											) &&
												fallbackMediaName) || <FormattedMessage {...messages.unknown} />}
									</MetadataFileName>
									<MetadataSubText data-testid="media-viewer-file-metadata-text">
										<FormattedMessageWrapper>{renderFileTypeText(item)}</FormattedMessageWrapper>
										{item.size ? ' · ' + toHumanReadableMediaSize(item.size) : ''}
									</MetadataSubText>
								</MedatadataTextWrapper>
							</MetadataWrapper>
						),
					pending: () => null,
					failed: () => null,
				})}
			</LeftHeader>
			<RightHeader>
				{extensions?.headerActions?.map((action, index) => {
					if (action.isVisible && !action.isVisible(identifier)) {
						return null;
					}
					return (
						<MediaButton
							key={index}
							testId={`media-viewer-header-action-${index}`}
							onClick={() => action.onClick(identifier, { close: onClose || (() => {}) })}
							iconBefore={action.icon as ReactChild}
							aria-label={action.label}
						/>
					);
				})}
				{extensions?.sidebar && (
					<MediaButton
						isSelected={isSidebarVisible}
						testId="media-viewer-sidebar-button"
						onClick={onSidebarButtonClick}
						iconBefore={extensions.sidebar.icon as ReactChild}
					/>
				)}
				{item.match({
					pending: () => DisabledToolbarDownloadButton,
					failed: () => DisabledToolbarDownloadButton,
					successful: (item) => (
						<ToolbarDownloadButton
							state={item}
							identifier={identifier}
							mediaClient={mediaClient}
							traceContext={traceContext}
						/>
					),
				})}
			</RightHeader>
		</HeaderWrapper>
	);
};

export default injectIntl(Header) as React.FC<Props>;
