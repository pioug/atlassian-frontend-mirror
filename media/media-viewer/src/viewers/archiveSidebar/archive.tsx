/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
import React from 'react';
import { unzip, type ZipInfo, type ZipEntry, HTTPRangeReader, type Reader } from 'unzipit';
import { FormattedMessage } from 'react-intl-next';

import { type MediaClient, type FileState } from '@atlaskit/media-client';
import { CustomMediaPlayer, messages } from '@atlaskit/media-ui';
import { getLanguageType, isCodeViewerItem } from '@atlaskit/media-ui/codeViewer';
import { Text } from '@atlaskit/primitives/compiled';

import { Outcome } from '../../domain';
import {
	CustomVideoPlayerWrapper,
	AudioPlayer,
	CustomAudioPlayerWrapper,
	DefaultCoverWrapper,
	ListWrapper,
} from '../../styleWrappers';
import AudioIcon from '@atlaskit/icon/core/migration/audio--media-services-audio';
import ErrorMessage from '../../errorMessage';
import { BaseViewer } from '../base-viewer';
import { InteractiveImg } from '../image/interactive-img';
import { PDFRenderer } from '../doc/pdfRenderer';
import { ArchiveItemViewerWrapper, ArchiveLayout, ArchiveViewerWrapper } from './styleWrappers';
import ArchiveSidebarRenderer from './archive-sidebar-renderer';
import { getMediaTypeFromFilename, getMimeTypeFromFilename, rejectAfter } from '../../utils';
import { Spinner } from '../../loading';
import { ENCRYPTED_ENTRY_ERROR_MESSAGE } from './consts';
import { type ArchiveViewerProps } from './types';
import { withAnalyticsEvents, type WithAnalyticsEventsProps } from '@atlaskit/analytics-next';
import { fireAnalytics } from '../../analytics';
import {
	type ArchiveViewerErrorReason,
	ArchiveViewerError,
	isMediaViewerError,
} from '../../errors';
import { createZipEntryLoadSucceededEvent } from '../../analytics/events/operational/zipEntryLoadSucceeded';
import { createZipEntryLoadFailedEvent } from '../../analytics/events/operational/zipEntryLoadFailed';
import { CodeViewRenderer } from '../codeViewer/codeViewerRenderer';
import { DEFAULT_LANGUAGE } from '../codeViewer/util';
import { MAX_FILE_SIZE_SUPPORTED_BY_CODEVIEWER } from '../../item-viewer';
import { type CustomRendererConfig } from '../../viewerOptions';

export type Props = ArchiveViewerProps & WithAnalyticsEventsProps;

export type Content = {
	src?: string;
	name?: string;
	isDirectory?: boolean;
	selectedArchiveEntry?: ZipEntry;
	hasLoadedEntries?: boolean;
	error?: ArchiveViewerError;
	codeViewerSrc?: string;
	isCodeMimeType?: boolean;
};

export const getArchiveEntriesFromFileState = async (
	fileState: FileState,
	mediaClient: MediaClient,
	collectionName?: string,
): Promise<ZipInfo> => {
	const url = await mediaClient.file.getFileBinaryURL(fileState.id, collectionName);
	const reader = new HTTPRangeReader(url);
	const archive = await rejectAfter(() => unzip(reader as Reader));

	return archive;
};

export class ArchiveViewerBase extends BaseViewer<Content, Props> {
	protected async init() {
		this.setState(this.initialState);
	}

	protected get initialState() {
		return {
			content: Outcome.successful<Content, ArchiveViewerError>({
				src: '',
				name: '',
				isDirectory: true,
			}),
		};
	}

	protected release() {
		const { content } = this.state;
		if (!content.data || !content.data.src) {
			return;
		}

		URL.revokeObjectURL(content.data.src);
	}

	private onError = (error: ArchiveViewerError, entry?: ZipEntry) => {
		this.props.onError(error);

		this.setState({
			content: Outcome.successful<Content, ArchiveViewerError>({
				...this.state.content.data,
				selectedArchiveEntry: entry,
				error,
			}),
		});
	};

	private onSelectedArchiveEntryChange = async (selectedArchiveEntry: ZipEntry) => {
		this.setState({
			content: Outcome.successful<Content, ArchiveViewerError>({
				...this.state.content.data,
				selectedArchiveEntry: undefined,
				hasLoadedEntries: false, // displays a nice loading spinner for the content viewer
			}),
		});
		let src = '';
		let codeViewerSrc = '';

		const isCodeMimeType = isCodeViewerItem(
			selectedArchiveEntry.name,
			getMimeTypeFromFilename(selectedArchiveEntry.name),
		);

		if (!selectedArchiveEntry.isDirectory) {
			try {
				const blob = await rejectAfter(() => selectedArchiveEntry.blob(), 10000);
				src = URL.createObjectURL(blob);
				if (isCodeMimeType) {
					codeViewerSrc = await rejectAfter(() => blob.text());
				}
			} catch (error: any) {
				return this.onError(
					new ArchiveViewerError(
						error.message === ENCRYPTED_ENTRY_ERROR_MESSAGE
							? 'archiveviewer-encrypted-entry'
							: 'archiveviewer-create-url',
						error,
					),
					selectedArchiveEntry,
				);
			}
		}

		this.setState({
			content: Outcome.successful<Content, ArchiveViewerError>({
				...this.state.content.data,
				selectedArchiveEntry,
				src,
				name: selectedArchiveEntry.name,
				isDirectory: selectedArchiveEntry.isDirectory,
				error: undefined,
				codeViewerSrc,
				isCodeMimeType,
				hasLoadedEntries: true,
			}),
		});
	};

	private onHeaderClicked = () => {
		// This will set the preview to show the Folder icon
		this.setState({
			content: Outcome.successful<Content, ArchiveViewerError>({
				...this.state.content.data,
			}),
		});
	};

	private onViewerLoad = (selectedArchiveEntry: ZipEntry) => () => {
		fireAnalytics(
			createZipEntryLoadSucceededEvent(this.props.item, selectedArchiveEntry),
			this.props.createAnalyticsEvent,
		);
	};

	private onViewerError =
		(primaryErrorReason: ArchiveViewerErrorReason, selectedArchiveEntry: ZipEntry) =>
		(error?: Error) =>
			error && isMediaViewerError(error)
				? this.onError(
						new ArchiveViewerError(primaryErrorReason, error.secondaryError, selectedArchiveEntry),
					)
				: this.onError(new ArchiveViewerError(primaryErrorReason, error, selectedArchiveEntry));

	private onSidebarLoaded = () => {
		this.setState({
			content: Outcome.successful<Content, ArchiveViewerError>({
				...this.state.content.data,
				hasLoadedEntries: true,
			}),
		});
		this.props.onSuccess();
	};

	protected renderSuccessful(content: Content): React.JSX.Element {
		const { item, mediaClient, collectionName } = this.props;
		const { selectedArchiveEntry, hasLoadedEntries } = content;
		const hasSelectedArchiveEntry = selectedArchiveEntry !== undefined;

		return (
			<ArchiveLayout>
				<ArchiveSidebarRenderer
					selectedFileState={item}
					mediaClient={mediaClient}
					onSelectedArchiveEntryChange={this.onSelectedArchiveEntryChange}
					onHeaderClicked={this.onHeaderClicked}
					isArchiveEntryLoading={!hasSelectedArchiveEntry}
					collectionName={collectionName}
					onError={this.onError}
					onSuccess={this.onSidebarLoaded}
				/>
				<ArchiveViewerWrapper>
					{!hasSelectedArchiveEntry && !hasLoadedEntries ? (
						<ListWrapper>
							<Spinner />
						</ListWrapper>
					) : (
						this.renderArchiveItemViewer(content)
					)}
				</ArchiveViewerWrapper>
			</ArchiveLayout>
		);
	}

	private renderArchiveItemViewer(content: Content) {
		const { item, viewerOptions } = this.props;
		const { src, name, isDirectory, error, selectedArchiveEntry, codeViewerSrc, isCodeMimeType } =
			content;
		if (error) {
			return this.renderPreviewError(error, selectedArchiveEntry);
		}

		if (!isDirectory && selectedArchiveEntry) {
			if (!name || !src) {
				return this.renderPreviewError(
					new ArchiveViewerError('archiveviewer-missing-name-src'),
					selectedArchiveEntry,
				);
			}

			const customRenderer = viewerOptions?.customRenderers?.find(
				(renderer: CustomRendererConfig) =>
					renderer.shouldUseCustomRenderer({ fileItem: item, archiveFileItem: { name } }),
			);
			if (customRenderer) {
				return (
					<ArchiveItemViewerWrapper>
						{customRenderer.renderContent({
							fileItem: item,
							archiveFileItem: { name },
							getBinaryContent: async () => (await fetch(src)).blob(),
							onLoad: this.onViewerLoad(selectedArchiveEntry),
							onError: this.onViewerError(
								'archiveviewer-customrenderer-onerror',
								selectedArchiveEntry,
							),
						})}
					</ArchiveItemViewerWrapper>
				);
			}
			const mediaType = getMediaTypeFromFilename(name);

			if (isCodeMimeType) {
				// Same code viewer logic as in Item-Viewer.tsx
				// Render error message if code file has size over 10MB.
				// Required by https://product-fabric.atlassian.net/browse/MEX-1788
				if (selectedArchiveEntry?.size > MAX_FILE_SIZE_SUPPORTED_BY_CODEVIEWER) {
					return this.renderPreviewError(
						new ArchiveViewerError('archiveviewer-codeviewer-file-size-exceeds'),
						selectedArchiveEntry,
					);
				}
				return (
					<CodeViewRenderer
						onSuccess={this.onViewerLoad(selectedArchiveEntry)}
						onError={this.onViewerError('archiveviewer-codeviewer-onerror', selectedArchiveEntry)}
						item={item}
						src={codeViewerSrc || ''}
						language={getLanguageType(name) || DEFAULT_LANGUAGE}
					/>
				);
			}

			switch (mediaType) {
				case 'image':
					return (
						<ArchiveItemViewerWrapper>
							<InteractiveImg
								src={src}
								alt={name}
								onLoad={this.onViewerLoad(selectedArchiveEntry)}
								onError={this.onViewerError(
									'archiveviewer-imageviewer-onerror',
									selectedArchiveEntry,
								)}
							/>
						</ArchiveItemViewerWrapper>
					);
				case 'video':
					return (
						<ArchiveItemViewerWrapper>
							<CustomVideoPlayerWrapper data-testid="media-viewer-video-content">
								<CustomMediaPlayer
									type="video"
									isAutoPlay={false}
									src={src}
									onCanPlay={this.onViewerLoad(selectedArchiveEntry)}
									onError={this.onViewerError(
										'archiveviewer-videoviewer-onerror',
										selectedArchiveEntry,
									)}
								/>
							</CustomVideoPlayerWrapper>
						</ArchiveItemViewerWrapper>
					);
				case 'audio':
					return (
						<ArchiveItemViewerWrapper>
							<AudioPlayer data-testid="media-viewer-audio-content">
								<DefaultCoverWrapper>
									<AudioIcon
										label="cover"
										LEGACY_size="xlarge"
										color="currentColor"
										// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
										LEGACY_primaryColor="#22272B"
										// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
										LEGACY_secondaryColor="#9FADBC"
									/>
								</DefaultCoverWrapper>
								<CustomAudioPlayerWrapper>
									<CustomMediaPlayer
										type="audio"
										isAutoPlay={false}
										src={src}
										onCanPlay={this.onViewerLoad(selectedArchiveEntry)}
										onError={this.onViewerError(
											'archiveviewer-audioviewer-onerror',
											selectedArchiveEntry,
										)}
									/>
								</CustomAudioPlayerWrapper>
							</AudioPlayer>
						</ArchiveItemViewerWrapper>
					);
				case 'doc':
					return (
						<ArchiveItemViewerWrapper>
							<PDFRenderer
								item={item}
								src={src}
								onSuccess={this.onViewerLoad(selectedArchiveEntry)}
								onError={this.onViewerError(
									'archiveviewer-docviewer-onerror',
									selectedArchiveEntry,
								)}
							/>
						</ArchiveItemViewerWrapper>
					);
				case 'archive':
					//BMPT-388 - Add illustration here, currently empty viewer
					return <ArchiveItemViewerWrapper></ArchiveItemViewerWrapper>;
				default:
					return this.renderPreviewError(
						new ArchiveViewerError('archiveviewer-unsupported'),
						selectedArchiveEntry,
					);
			}
		}
	}

	private renderPreviewError(error: ArchiveViewerError, entry?: ZipEntry) {
		const { item, createAnalyticsEvent } = this.props;

		fireAnalytics(createZipEntryLoadFailedEvent(item, error, entry), createAnalyticsEvent);

		return (
			<ListWrapper>
				<ErrorMessage fileId={item.id} fileState={item} error={error} supressAnalytics={true}>
					<Text>
						<FormattedMessage {...messages.try_downloading_file} />
					</Text>
				</ErrorMessage>
			</ListWrapper>
		);
	}
}

export const ArchiveViewer = withAnalyticsEvents()(ArchiveViewerBase);
