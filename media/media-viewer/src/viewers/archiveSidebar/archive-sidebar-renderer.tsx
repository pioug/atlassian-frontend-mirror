import React, { Component } from 'react';

import { type MediaClient, type FileState, isErrorFileState } from '@atlaskit/media-client';

import { SpinnerWrapper } from '../../styleWrappers';
import { ArchiveSidebar } from './archive-sidebar';
import { getArchiveEntriesFromFileState } from './archive';
import { Spinner } from '../../loading';
import { ArchiveViewerError } from '../../errors';
import { ArchiveSideBar } from './styleWrappers';
import { type ZipEntry } from 'unzipit';

export interface ArchiveSidebarRendererProps {
	selectedFileState: FileState;
	mediaClient: MediaClient;
	onSelectedArchiveEntryChange: (archiveEntry: ZipEntry) => void;
	onHeaderClicked: () => void;
	isArchiveEntryLoading: boolean;
	collectionName?: string;
	onError: (error: ArchiveViewerError, entry?: ZipEntry) => void;
	onSuccess: () => void;
}

interface ArchiveSidebarRendererState {
	entries: { [key: string]: ZipEntry };
	status: 'loading' | 'loaded';
}

export default class ArchiveSidebarRenderer extends Component<
	ArchiveSidebarRendererProps,
	ArchiveSidebarRendererState
> {
	state: ArchiveSidebarRendererState = {
		entries: {},
		status: 'loading',
	};

	async componentDidMount() {
		const { selectedFileState, mediaClient, collectionName, onError, onSuccess } = this.props;

		try {
			const archive = await getArchiveEntriesFromFileState(
				selectedFileState,
				mediaClient,
				collectionName,
			);
			const entries = archive.entries;
			this.setState({ entries, status: 'loaded' });
			onSuccess();
		} catch (error) {
			this.setState({ status: 'loaded' });
			onError(
				new ArchiveViewerError(
					'archiveviewer-read-binary',
					error instanceof Error ? error : undefined,
				),
			);
		}
	}

	render(): React.JSX.Element {
		const { entries, status } = this.state;
		const {
			mediaClient,
			onHeaderClicked,
			isArchiveEntryLoading,
			onSelectedArchiveEntryChange,
			onError,
			selectedFileState,
		} = this.props;
		return (
			<>
				{(status === 'loading' && (
					<ArchiveSideBar>
						<SpinnerWrapper>
							<Spinner />
						</SpinnerWrapper>
					</ArchiveSideBar>
				)) || (
					<ArchiveSidebar
						entries={entries}
						onEntrySelected={onSelectedArchiveEntryChange}
						onHeaderClicked={onHeaderClicked}
						mediaClient={mediaClient}
						isArchiveEntryLoading={isArchiveEntryLoading}
						onError={onError}
						shouldRenderAbuseModal={
							!isErrorFileState(selectedFileState) && !!selectedFileState.abuseClassification
						}
						fileId={selectedFileState.id}
					/>
				)}
			</>
		);
	}
}
