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

export const ArchiveItemViewerWrapper = (props: Children): React.JSX.Element => (
	<CompiledArchiveItemViewerWrapper {...props} />
);

export const ArchiveSideBar = (props: Children): React.JSX.Element => (
	<TouchScrollable>
		<CompiledArchiveSideBar {...props} />
	</TouchScrollable>
);

export const ArchiveSidebarFolderWrapper = (props: Children): React.JSX.Element => (
	<CompiledArchiveSidebarFolderWrapper {...props} />
);

export const ArchiveDownloadButtonWrapper = (props: Children & OnClick): React.JSX.Element => (
	<CompiledArchiveDownloadButtonWrapper {...props} />
);

export const DisabledArchiveDownloadButtonWrapper = (props: Children): React.JSX.Element => (
	<CompiledDisabledArchiveDownloadButtonWrapper {...props} />
);

export const SidebarItemWrapper = (props: Children): React.JSX.Element => (
	<CompiledSidebarItemWrapper {...props} />
);

export const ArchiveSidebarFileEntryWrapper = (
	props: { index: Key } & Children,
): React.JSX.Element => <CompiledArchiveSidebarFileEntryWrapper {...props} />;

export const ArchiveLayout = (props: Children): React.JSX.Element => (
	<CompiledArchiveLayout {...props} />
);

export const ArchiveViewerWrapper = (props: Children): React.JSX.Element => (
	<CompiledArchiveViewerWrapper {...props} />
);

export const Separator = (): React.JSX.Element => <CompiledSeparator />;

export const SidebarHeaderWrapper = (props: Children): React.JSX.Element => (
	<CompiledSidebarHeaderWrapper {...props} />
);

export const SidebarHeaderIcon = (props: Children): React.JSX.Element => (
	<CompiledSidebarHeaderIcon {...props} />
);

export const SidebarHeaderEntry = (props: Children): React.JSX.Element => (
	<CompiledSidebarHeaderEntry {...props} />
);
