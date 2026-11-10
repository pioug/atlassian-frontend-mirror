/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */

import React from 'react';

import { FormattedMessage } from 'react-intl';
import { type ZipEntry } from 'unzipit';

import AudioIcon from '@atlaskit/icon/core/audio';
import { CustomMediaPlayer } from '@atlaskit/media-ui/customMediaPlayer';
import { getLanguageType } from '@atlaskit/media-ui/getLanguageType';
import { isCodeViewerItem } from '@atlaskit/media-ui/isCodeViewerItem';
import { messages } from '@atlaskit/media-ui/messages';
import { fg } from '@atlaskit/platform-feature-flags/fg';
import { Text } from '@atlaskit/primitives/compiled/text';

import { createPreviewUnsupportedEvent } from '../../analytics/events/operational/previewUnsupported';
import { createZipEntryLoadFailedEvent } from '../../analytics/events/operational/zipEntryLoadFailed';
import { createZipEntryLoadSucceededEvent } from '../../analytics/events/operational/zipEntryLoadSucceeded';
import { createFailedPreviewDownloadButtonClickedEvent } from '../../analytics/events/ui/failedPreviewDownloadButtonClicked';
import { fireAnalytics } from '../../analytics/fireAnalytics';
import { type ArchiveViewerErrorReason, ArchiveViewerError } from '../../ArchiveViewerError';
import { buildVideoErrorDiagnostics } from '../../buildVideoErrorDiagnostics';
import { Outcome } from '../../domain/outcome';
import { DownloadItem } from '../../DownloadItem';
import ErrorMessage from '../../errorMessageWithAnalytics';
import { type WithInsetViewerProps } from '../../insetViewerContext';
import { isMediaViewerError } from '../../isMediaViewerError';
import { MAX_FILE_SIZE_SUPPORTED_BY_CODEVIEWER } from '../../item-viewer';
import { Spinner } from '../../loading';
import {
	CustomMediaPlayerWrapper,
	AudioPlayer,
	CustomAudioPlayerWrapper,
	DefaultCoverWrapper,
	DownloadButtonWrapper,
	ItemStage,
	ListWrapper,
} from '../../styleWrappers';
import { getMediaTypeFromFilename } from '../../utils/getMediaTypeFromFilename';
import { getMimeTypeFromFilename } from '../../utils/getMimeTypeFromFilename';
import { rejectAfter } from '../../utils/rejectAfter';
import { type CustomRendererConfig } from '../../viewerOptions';
import { BaseViewer } from '../base-viewer';
import { CodeViewRenderer } from '../codeViewer/CodeViewRenderer-2';
import { DEFAULT_LANGUAGE } from '../codeViewer/util';
import { InteractiveImg } from '../image/interactive-img';
import { InsetAudioFrame, type InsetAudioPlayerProps } from '../inset-audio-frame';
import { InsetVideoFrame, type InsetVideoPlayerProps } from '../inset-video-frame';
import type { Content, Props } from './archive';
import { ArchiveItemViewerWrapper } from './archive-item-viewer-wrapper';
import { ArchiveLayout } from './archive-layout';
import ArchiveSidebarRenderer from './archive-sidebar-renderer';
import { ArchiveViewerWrapper } from './archive-viewer-wrapper';
import { ENCRYPTED_ENTRY_ERROR_MESSAGE } from './consts';
import { downloadArchiveEntry } from './download-archive-entry';
import { canRenderInNativePdfViewer, NativePdfViewer } from './nativePdfViewer';
import { ArchiveEmptyState } from './styleWrappers';

// The entry itself couldn't be read, so downloading it would fail the same way.
const UNREADABLE_ENTRY_REASONS: ReadonlyArray<ArchiveViewerErrorReason> = [
	'archiveviewer-encrypted-entry',
	'archiveviewer-create-url',
];

export class ArchiveViewerBase extends BaseViewer<Content, Props & WithInsetViewerProps> {
	protected async init(): Promise<void> {
		this.setState(this.initialState);
	}

	protected get initialState(): {
		content: Outcome<Content, ArchiveViewerError>;
	} {
		return {
			content: Outcome.successful<Content, ArchiveViewerError>({
				src: '',
				name: '',
				isDirectory: true,
			}),
		};
	}

	protected release(): void {
		const { content } = this.state;
		if (!content.data || !content.data.src) {
			return;
		}

		URL.revokeObjectURL(content.data.src);
	}

	private onError = (error: ArchiveViewerError, entry?: ZipEntry) => {
		// Non-ZIP archives (e.g. RAR, TAR, 7z) are a known limitation of the
		// browser-based `unzipit` viewer, not a per-entry failure. Render a
		// full-width "format not supported" message via BaseViewer's failed
		// outcome (no sidebar, no 300px offset) and do NOT escalate to the
		// parent item-viewer error boundary, which would double-render the
		// message inside the offset archive layout.
		if (error.primaryReason === 'archiveviewer-not-zip') {
			// Fire a dedicated, non-SLI `previewUnsupported` event (not a
			// `loadFailed`) so unsupported archives don't pollute error
			// dashboards. The event's fileAttributes distinguish the two cases:
			// `fileMediatype: 'unknown'` (browser-unrecognised, e.g. RAR) vs
			// `fileMediatype: 'archive'` with a non-ZIP `fileMimetype` (unzipit
			// limitation, e.g. 7z/tar/gzip).
			fireAnalytics(
				createPreviewUnsupportedEvent(this.props.item),
				this.props.createAnalyticsEvent,
			);
			this.setState({
				content: Outcome.failed<Content, ArchiveViewerError>(error),
			});
			return;
		}

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

		const mimeType = getMimeTypeFromFilename(selectedArchiveEntry.name);

		const isCodeMimeType = isCodeViewerItem(selectedArchiveEntry.name, mimeType);

		if (
			this.props.isInsetViewer &&
			!selectedArchiveEntry.isDirectory &&
			getMediaTypeFromFilename(selectedArchiveEntry.name) === 'doc' &&
			!canRenderInNativePdfViewer(mimeType)
		) {
			fireAnalytics(
				createPreviewUnsupportedEvent(this.props.item),
				this.props.createAnalyticsEvent,
			);
		}

		if (!selectedArchiveEntry.isDirectory) {
			try {
				const blob = await rejectAfter<Blob>(() => selectedArchiveEntry.blob(), 10000);
				const blobWithMimeType = new Blob([blob], { type: mimeType });
				src = URL.createObjectURL(blobWithMimeType);
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
		(error?: Error | MediaError | null) => {
			if (error instanceof Error && isMediaViewerError(error)) {
				return this.onError(
					new ArchiveViewerError(primaryErrorReason, error.secondaryError, selectedArchiveEntry),
				);
			}
			// The video/audio CustomMediaPlayer surfaces a native `MediaError` (not a
			// JS `Error`). Convert it into a descriptive diagnostics `Error` so the
			// downstream analytics report a meaningful cause instead of `unknown`.
			const secondaryError =
				error && !(error instanceof Error)
					? buildVideoErrorDiagnostics(undefined, error)
					: (error ?? undefined);
			return this.onError(
				new ArchiveViewerError(primaryErrorReason, secondaryError, selectedArchiveEntry),
			);
		};

	private onSidebarLoaded = () => {
		this.setState({
			content: Outcome.successful<Content, ArchiveViewerError>({
				...this.state.content.data,
				hasLoadedEntries: true,
			}),
		});
		this.props.onSuccess();
		if (fg('download_event_for_jira_attachments')) {
			this.onMediaDisplayed();
		}
	};

	protected renderSuccessful(content: Content): React.JSX.Element {
		const { item, mediaClient, collectionName, isInsetViewer } = this.props;
		const { selectedArchiveEntry, hasLoadedEntries } = content;
		const hasSelectedArchiveEntry = selectedArchiveEntry !== undefined;

		const sidebar = (
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
		);
		const viewer = (
			<ArchiveViewerWrapper>
				{!hasSelectedArchiveEntry && !hasLoadedEntries
					? this.renderCentered(<Spinner />)
					: this.renderArchiveItemViewer(content)}
			</ArchiveViewerWrapper>
		);

		// The inset viewer shows the file list on the right, so it comes after the preview.
		return (
			<ArchiveLayout>
				{isInsetViewer ? viewer : sidebar}
				{isInsetViewer ? sidebar : viewer}
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
						<ArchiveItemViewerWrapper fullHeight={this.props.isInsetViewer}>
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
				case 'video': {
					const renderVideoPlayer = (insetPlayerProps?: InsetVideoPlayerProps) => (
						<CustomMediaPlayer
							type="video"
							isAutoPlay={false}
							src={src}
							onCanPlay={this.onViewerLoad(selectedArchiveEntry)}
							onError={this.onViewerError(
								'archiveviewer-videoviewer-onerror',
								selectedArchiveEntry,
							)}
							{...insetPlayerProps}
						/>
					);
					return (
						<ArchiveItemViewerWrapper fullHeight={this.props.isInsetViewer}>
							{this.props.isInsetViewer ? (
								<InsetVideoFrame
									data-testid="media-viewer-video-content"
									renderPlayer={renderVideoPlayer}
								/>
							) : (
								<CustomMediaPlayerWrapper data-testid="media-viewer-video-content">
									{renderVideoPlayer()}
								</CustomMediaPlayerWrapper>
							)}
						</ArchiveItemViewerWrapper>
					);
				}
				case 'audio': {
					const renderAudioPlayer = (insetPlayerProps?: InsetAudioPlayerProps) => (
						<CustomMediaPlayer
							type="audio"
							isAutoPlay={false}
							src={src}
							onCanPlay={this.onViewerLoad(selectedArchiveEntry)}
							onError={this.onViewerError(
								'archiveviewer-audioviewer-onerror',
								selectedArchiveEntry,
							)}
							{...insetPlayerProps}
						/>
					);
					return (
						<ArchiveItemViewerWrapper fullHeight={this.props.isInsetViewer}>
							{this.props.isInsetViewer ? (
								<InsetAudioFrame renderPlayer={renderAudioPlayer} />
							) : (
								<AudioPlayer data-testid="media-viewer-audio-content">
									<DefaultCoverWrapper>
										<AudioIcon label="cover" color="currentColor" />
									</DefaultCoverWrapper>
									<CustomAudioPlayerWrapper>{renderAudioPlayer()}</CustomAudioPlayerWrapper>
								</AudioPlayer>
							)}
						</ArchiveItemViewerWrapper>
					);
				}
				case 'doc':
					// The native viewer can't show this, and the browser would download it and leave the stage
					// blank, so the inset viewer shows the can't-preview message instead.
					if (
						this.props.isInsetViewer &&
						!canRenderInNativePdfViewer(getMimeTypeFromFilename(name))
					) {
						// Not a load failure: it's reported once from the selection, as previewUnsupported.
						return this.renderPreviewError(
							new ArchiveViewerError('archiveviewer-unsupported'),
							selectedArchiveEntry,
							false,
						);
					}
					return (
						<ArchiveItemViewerWrapper fullHeight={true}>
							<NativePdfViewer
								src={src}
								onSuccess={this.onViewerLoad(selectedArchiveEntry)}
								onError={this.onViewerError(
									'archiveviewer-docviewer-onerror',
									selectedArchiveEntry,
								)}
							>
								{this.renderPreviewError(
									new ArchiveViewerError('archiveviewer-docviewer-onerror'),
									selectedArchiveEntry,
									false,
								)}
							</NativePdfViewer>
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

		// Nothing is picked yet, so the inset viewer asks for one instead of leaving the stage blank.
		if (this.props.isInsetViewer) {
			return <ArchiveEmptyState />;
		}
	}

	private downloadEntry = async (entry: ZipEntry) => {
		try {
			await downloadArchiveEntry(
				entry,
				entry.name.split('/').pop() ?? entry.name,
				this.props.item.id,
			);
		} catch (error) {
			this.onError(error as ArchiveViewerError, entry);
		}
	};

	private renderPreviewError(
		error: ArchiveViewerError,
		entry?: ZipEntry,
		shouldFireAnalytics = true,
	) {
		const { item, createAnalyticsEvent } = this.props;

		if (shouldFireAnalytics) {
			fireAnalytics(createZipEntryLoadFailedEvent(item, error, entry), createAnalyticsEvent);
		}

		return this.renderCentered(
			<ErrorMessage fileId={item.id} fileState={item} error={error} supressAnalytics={true}>
				<Text>
					<FormattedMessage {...messages.try_downloading_file} />
				</Text>
				{/* The inset viewer offers the download here too, as it does for a file of its own. */}
				{this.props.isInsetViewer &&
				entry &&
				!UNREADABLE_ENTRY_REASONS.includes(error.primaryReason) ? (
					<DownloadButtonWrapper>
						<DownloadItem
							testId="media-viewer-error-download-button"
							appearance="primary"
							variant="insetText"
							analyticspayload={createFailedPreviewDownloadButtonClickedEvent(item, error)}
							fileState={item}
							mediaClient={this.props.mediaClient}
							traceContext={this.props.traceContext}
							onDownload={() => this.downloadEntry(entry)}
						>
							<FormattedMessage {...messages.download} />
						</DownloadItem>
					</DownloadButtonWrapper>
				) : null}
			</ErrorMessage>,
		);
	}

	// In the inset viewer the list wrapper is the viewer's column layout, not a centering box, so the
	// spinner and error view go in the item stage, as they do for a file of its own.
	private renderCentered(children: React.ReactNode) {
		return this.props.isInsetViewer ? (
			<ItemStage>{children}</ItemStage>
		) : (
			<ListWrapper>{children}</ListWrapper>
		);
	}
}
