import React from 'react';
import { type ZipEntry } from 'unzipit';

import Folder24Icon from '@atlaskit/icon-file-type/glyph/folder/24';
import { downloadUrl } from '@atlaskit/media-common';
import { MediaTypeIcon } from '@atlaskit/media-ui/media-type-icon';
import { type MediaClient, globalMediaEventEmitter } from '@atlaskit/media-client';
import { fg } from '@atlaskit/platform-feature-flags';

import {
	ArchiveSidebarFolderWrapper,
	ArchiveSidebarFileEntryWrapper,
	SidebarItemWrapper,
} from './styleWrappers';
import { getMediaTypeFromFilename, isMacPrivateFile, rejectAfter } from '../../utils';
import { type ArchiveViewerError } from '../../errors';
import { CustomButtonItem } from './custom-button-item';
import { messages } from '@atlaskit/media-ui';
import { ArchiveDownloadButton } from './archive-download-button';
import { type WrappedComponentProps, injectIntl } from 'react-intl-next';

type Entries = { [key: string]: ZipEntry };

export interface ArchiveSidebarFolderProps {
	root: string;
	entries: Entries;
	onEntrySelected: (selectedEntry: ZipEntry) => void;
	hideHeader?: boolean;
	name?: string;
	mediaClient: MediaClient;
	isArchiveEntryLoading: boolean;
	onError: (error: ArchiveViewerError, entry?: ZipEntry) => void;
	shouldRenderAbuseModal: boolean;
	fileId?: string;
}

class ArchiveSidebarFolderEntryBase extends React.Component<
	ArchiveSidebarFolderProps & WrappedComponentProps,
	{ isAbuseModalOpen: boolean }
> {
	state = { isAbuseModalOpen: false };

	renderEntry = (entry: ZipEntry) => {
		const { root, onEntrySelected, mediaClient } = this.props;
		const onClick = () => onEntrySelected(entry);

		return (
			<ArchiveSidebarFileEntryWrapper key={entry.name} index={entry.name}>
				<SidebarItemWrapper>
					<CustomButtonItem iconBefore={this.renderEntryIcon(entry)} onClick={onClick}>
						{this.formatName(root, entry.name)}
					</CustomButtonItem>
				</SidebarItemWrapper>
				{entry.isDirectory
					? null
					: this.renderDownloadButton(entry, root, mediaClient.config.enforceDataSecurityPolicy)}
			</ArchiveSidebarFileEntryWrapper>
		);
	};

	private renderEntryIcon = (entry: ZipEntry) => {
		if (entry.isDirectory) {
			return <Folder24Icon label="Folder" />;
		}
		const mediaType = getMediaTypeFromFilename(entry.name);
		return <MediaTypeIcon type={mediaType} />;
	};

	private renderDownloadButton = (
		entry: ZipEntry,
		root: string,
		enforceDataSecurityPolicy?: boolean,
	) => {
		const { shouldRenderAbuseModal, intl } = this.props;

		const tooltip = enforceDataSecurityPolicy
			? intl.formatMessage(messages.download_disabled_security_policy)
			: undefined;
		const downloadFn = () => this.downloadZipEntry(entry, root);

		return (
			<ArchiveDownloadButton
				downloadFn={downloadFn}
				shouldRenderAbuseModal={shouldRenderAbuseModal}
				isDisabled={enforceDataSecurityPolicy}
				tooltip={tooltip}
			/>
		);
	};

	private downloadZipEntry = async (entry: ZipEntry, root: string) => {
		try {
			const blob = await rejectAfter<Blob>(() => entry.blob());
			const name = this.formatName(root, entry.name);

			// Emit media-viewed event if feature flag is enabled
			if (this.props.fileId && fg('download_event_for_jira_attachments')) {
				globalMediaEventEmitter.emit('media-viewed', {
					fileId: this.props.fileId,
					viewingLevel: 'download',
					childFileName: name,
				});
			}

			downloadUrl(URL.createObjectURL(blob), { name });
		} catch (error) {
			this.props.onError(error as ArchiveViewerError, entry);
		}
	};

	private formatName(root: string, name: string) {
		return name.replace(root, '');
	}

	private renderSidebarContent(root: string, entries: Entries) {
		const navItems = new Map<string, ZipEntry>();

		for (const value of Object.values(entries)) {
			const { name } = value;
			if (!name.startsWith(root) || isMacPrivateFile(name)) {
				continue;
			}

			const paths = name.replace(root, '').split('/').filter(Boolean);

			if (paths.length > 1) {
				if (!navItems.has(paths[0])) {
					navItems.set(paths[0], {
						name: `${root}${paths[0]}/`,
						isDirectory: true,
					} as ZipEntry);
				}
			} else if (paths.length === 1) {
				navItems.set(paths[0], value);
			}
		}

		return Array.from(navItems.values()).map(this.renderEntry);
	}

	render() {
		const { root, entries } = this.props;

		return (
			<ArchiveSidebarFolderWrapper>
				{this.renderSidebarContent(root, entries)}
			</ArchiveSidebarFolderWrapper>
		);
	}
}

export const ArchiveSidebarFolderEntry = injectIntl(ArchiveSidebarFolderEntryBase);
