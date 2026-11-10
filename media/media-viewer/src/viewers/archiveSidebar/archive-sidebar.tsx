import React from 'react';

import { FormattedMessage } from 'react-intl';
import { type ZipEntry, type ZipInfo, unzip } from 'unzipit';

import { cssMap } from '@atlaskit/css';
import Heading from '@atlaskit/heading/heading';
import type { MediaClient } from '@atlaskit/media-client/media-client';
import { messages } from '@atlaskit/media-ui/messages';
import { Box } from '@atlaskit/primitives/compiled/box';
import { token } from '@atlaskit/tokens';

import type { ArchiveViewerError } from '../../ArchiveViewerError';
import { type WithInsetViewerProps, withInsetViewer } from '../../insetViewerContext';
import { extractArchiveFolderName } from '../../utils/extractArchiveFolderName';
import { getFolderParent } from '../../utils/getFolderParent';
import { getMediaTypeFromFilename } from '../../utils/getMediaTypeFromFilename';
import { rejectAfter } from '../../utils/rejectAfter';
import { ArchiveSidebarFileEntryWrapper } from './archive-sidebar-file-entry-wrapper';
import {
	ArchiveSidebarFolderEntry,
	type ArchiveSidebarFolderProps,
} from './archive-sidebar-folder-entry';
import { ArchiveSidebarHeader } from './archive-sidebar-header';
import { Separator } from './separator';
import { SidebarItemWrapper } from './sidebar-item-wrapper';
import { ArchiveSideBar } from './styleWrappers';

const styles = cssMap({
	heading: {
		paddingBottom: token('space.150'),
		paddingLeft: token('space.200'),
		paddingRight: token('space.200'),
	},
});

export interface ArchiveSidebarProps {
	entries: { [key: string]: ZipEntry };
	onEntrySelected: (selectedEntry: ZipEntry) => void;
	mediaClient: MediaClient;
	onHeaderClicked: () => void;
	isArchiveEntryLoading: boolean;
	onError: (error: ArchiveViewerError, entry?: ZipEntry) => void;
	shouldRenderAbuseModal: boolean;
	fileId?: string;
}

export type ArchiveSidebarState = {
	currentArchiveSidebarFolder: ArchiveSidebarFolderProps;
	// The file entry last picked in the inset viewer, so the list shows it as selected straight away.
	selectedEntryName?: string;
};

class ArchiveSidebarBase extends React.Component<
	ArchiveSidebarProps & WithInsetViewerProps,
	ArchiveSidebarState
> {
	constructor(props: ArchiveSidebarProps & WithInsetViewerProps) {
		super(props);
		const { isArchiveEntryLoading, entries, mediaClient, onError, shouldRenderAbuseModal, fileId } =
			props;
		this.state = {
			currentArchiveSidebarFolder: {
				isArchiveEntryLoading,
				root: '',
				name: '/',
				entries,
				onEntrySelected: this.onEntrySelected,
				hideHeader: true,
				mediaClient,
				onError,
				shouldRenderAbuseModal,
				fileId,
			},
		};
	}

	private getArchiveFromEntry = async (entry: ZipEntry): Promise<ZipInfo> => {
		const blob = await rejectAfter<Blob>(() => entry.blob());
		const archive = await rejectAfter<ZipInfo>(() => unzip(blob));

		Object.values(archive.entries).forEach((zipEntry: ZipEntry) => {
			// eslint-disable-next-line no-param-reassign
			zipEntry.name = this.state.currentArchiveSidebarFolder.name + zipEntry.name;
		});
		return archive;
	};

	private onEntrySelected = async (entry: ZipEntry) => {
		const { onEntrySelected, isInsetViewer } = this.props;
		if (!entry.isDirectory) {
			if (isInsetViewer) {
				this.setState({ selectedEntryName: entry.name });
			}
			onEntrySelected(entry);
		}

		const isArchive = !entry.isDirectory && getMediaTypeFromFilename(entry.name) === 'archive';

		try {
			isArchive || entry.isDirectory ? await this.onFolderEntrySelected(entry, isArchive) : null;
		} catch (error) {
			return this.props.onError(error as ArchiveViewerError, entry);
		}
	};

	private onFolderEntrySelected = async (folder: ZipEntry, isArchive: boolean) => {
		let { entries, mediaClient } = this.props;
		let folderName: string | undefined;
		if (isArchive) {
			const archiveEntries = (await this.getArchiveFromEntry(folder)).entries;
			entries = { ...entries, ...archiveEntries };
			folderName = extractArchiveFolderName(folder.name);
		}
		const { isArchiveEntryLoading, onError, shouldRenderAbuseModal, fileId } = this.props;
		const currentFolderName = folderName || folder.name;
		this.setState({
			currentArchiveSidebarFolder: {
				isArchiveEntryLoading,
				root: currentFolderName,
				name: currentFolderName,
				entries,
				onEntrySelected: this.onEntrySelected,
				mediaClient,
				onError,
				shouldRenderAbuseModal,
				fileId,
			},
		});
	};

	private onHeaderClicked = () => {
		const {
			entries,
			mediaClient,
			onHeaderClicked,
			isArchiveEntryLoading,
			onError,
			shouldRenderAbuseModal,
			fileId,
		} = this.props;

		const folderParent = getFolderParent(this.state.currentArchiveSidebarFolder.root);

		this.setState({
			currentArchiveSidebarFolder: {
				isArchiveEntryLoading,
				root: folderParent,
				name: folderParent,
				entries,
				onEntrySelected: this.onEntrySelected,
				mediaClient,
				onError,
				shouldRenderAbuseModal,
				fileId,
			},
		});

		// This sets the preview to the Folder icon
		onHeaderClicked();
	};

	render(): React.JSX.Element {
		const { currentArchiveSidebarFolder } = this.state;
		const { onError, isInsetViewer } = this.props;
		const header = (
			<ArchiveSidebarHeader
				folderName={currentArchiveSidebarFolder.root}
				onHeaderClick={this.onHeaderClicked}
			/>
		);

		return (
			<ArchiveSideBar>
				{/* The inset viewer always shows the heading, so opening a folder doesn't move the list, and
				puts the Back row under it as one more row of the list. Neither has a separator. */}
				{isInsetViewer ? (
					<>
						<Box xcss={styles.heading}>
							<Heading as="h2" size="xxsmall">
								<FormattedMessage {...messages.archive_attachments_heading} />
							</Heading>
						</Box>
						{currentArchiveSidebarFolder.root ? (
							<ArchiveSidebarFileEntryWrapper index="back">
								<SidebarItemWrapper>{header}</SidebarItemWrapper>
							</ArchiveSidebarFileEntryWrapper>
						) : null}
					</>
				) : (
					<>
						{header}
						<Separator />
					</>
				)}
				<ArchiveSidebarFolderEntry
					{...currentArchiveSidebarFolder}
					onError={onError}
					selectedEntryName={this.state.selectedEntryName}
				/>
			</ArchiveSideBar>
		);
	}
}

export const ArchiveSidebar: React.ForwardRefExoticComponent<
	ArchiveSidebarProps & React.RefAttributes<any>
> = withInsetViewer(ArchiveSidebarBase);
