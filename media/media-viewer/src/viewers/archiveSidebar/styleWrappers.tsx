import React, { type ReactNode, type MouseEvent, type Key } from 'react';
import {
	ArchiveItemViewerWrapper as CompiledArchiveItemViewerWrapper,
	ArchiveSideBar as CompiledArchiveSideBar,
	ArchiveSidebarFolderWrapper as CompiledArchiveSidebarFolderWrapper,
	ArchiveDownloadButtonWrapper as CompiledArchiveDownloadButtonWrapper,
	DisabledArchiveDownloadButtonWrapper as CompiledDisabledArchiveDownloadButtonWrapper,
	SidebarItemWrapper as CompiledSidebarItemWrapper,
	ArchiveSidebarFileEntryWrapper as CompiledArchiveSidebarFileEntryWrapper,
	ArchiveLayout as CompiledArchiveLayout,
	ArchiveViewerWrapper as CompiledArchiveViewerWrapper,
	Separator as CompiledSeparator,
	SidebarHeaderWrapper as CompiledSidebarHeaderWrapper,
	SidebarHeaderIcon as CompiledSidebarHeaderIcon,
	SidebarHeaderEntry as CompiledSidebarHeaderEntry,
} from './styleWrappers-compiled';
import { TouchScrollable } from 'react-scrolllock';

type Children = {
	children?: ReactNode;
};
type OnClick = {
	onClick: (event: MouseEvent<HTMLDivElement>) => void;
};

export const ArchiveItemViewerWrapper = (props: Children) => (
	<CompiledArchiveItemViewerWrapper {...props} />
);

export const ArchiveSideBar = (props: Children) => (
	<TouchScrollable>
		<CompiledArchiveSideBar {...props} />
	</TouchScrollable>
);

export const ArchiveSidebarFolderWrapper = (props: Children) => (
	<CompiledArchiveSidebarFolderWrapper {...props} />
);

export const ArchiveDownloadButtonWrapper = (props: Children & OnClick) => (
	<CompiledArchiveDownloadButtonWrapper {...props} />
);

export const DisabledArchiveDownloadButtonWrapper = (props: Children) => (
	<CompiledDisabledArchiveDownloadButtonWrapper {...props} />
);

export const SidebarItemWrapper = (props: Children) => <CompiledSidebarItemWrapper {...props} />;

export const ArchiveSidebarFileEntryWrapper = (props: { index: Key } & Children) => (
	<CompiledArchiveSidebarFileEntryWrapper {...props} />
);

export const ArchiveLayout = (props: Children) => <CompiledArchiveLayout {...props} />;

export const ArchiveViewerWrapper = (props: Children) => (
	<CompiledArchiveViewerWrapper {...props} />
);

export const Separator = () => <CompiledSeparator />;

export const SidebarHeaderWrapper = (props: Children) => (
	<CompiledSidebarHeaderWrapper {...props} />
);

export const SidebarHeaderIcon = (props: Children) => <CompiledSidebarHeaderIcon {...props} />;

export const SidebarHeaderEntry = (props: Children) => <CompiledSidebarHeaderEntry {...props} />;
