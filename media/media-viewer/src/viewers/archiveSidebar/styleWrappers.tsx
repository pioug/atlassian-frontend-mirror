import React, { type ReactNode, type MouseEvent, type Key } from 'react';
import { fg } from '@atlaskit/platform-feature-flags';
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
import {
	ArchiveItemViewerWrapper as EmotionArchiveItemViewerWrapper,
	ArchiveSideBar as EmotionArchiveSideBar,
	ArchiveSidebarFolderWrapper as EmotionArchiveSidebarFolderWrapper,
	ArchiveDownloadButtonWrapper as EmotionArchiveDownloadButtonWrapper,
	DisabledArchiveDownloadButtonWrapper as EmotionDisabledArchiveDownloadButtonWrapper,
	SidebarItemWrapper as EmotionSidebarItemWrapper,
	ArchiveSidebarFileEntryWrapper as EmotionArchiveSidebarFileEntryWrapper,
	ArchiveLayout as EmotionArchiveLayout,
	ArchiveViewerWrapper as EmotionArchiveViewerWrapper,
	Separator as EmotionSeparator,
	SidebarHeaderWrapper as EmotionSidebarHeaderWrapper,
	SidebarHeaderIcon as EmotionSidebarHeaderIcon,
	SidebarHeaderEntry as EmotionSidebarHeaderEntry,
} from './styleWrappers-emotion';
import { TouchScrollable } from 'react-scrolllock';

type Children = {
	children?: ReactNode;
};
type OnClick = {
	onClick: (event: MouseEvent<HTMLDivElement>) => void;
};

export const ArchiveItemViewerWrapper = (props: Children) =>
	fg('platform_media_compiled') ? (
		<CompiledArchiveItemViewerWrapper {...props} />
	) : (
		<EmotionArchiveItemViewerWrapper {...props} />
	);

export const ArchiveSideBar = (props: Children) => (
	<TouchScrollable>
		{fg('platform_media_compiled') ? (
			<CompiledArchiveSideBar {...props} />
		) : (
			<EmotionArchiveSideBar {...props} />
		)}
	</TouchScrollable>
);

export const ArchiveSidebarFolderWrapper = (props: Children) =>
	fg('platform_media_compiled') ? (
		<CompiledArchiveSidebarFolderWrapper {...props} />
	) : (
		<EmotionArchiveSidebarFolderWrapper {...props} />
	);

export const ArchiveDownloadButtonWrapper = (props: Children & OnClick) =>
	fg('platform_media_compiled') ? (
		<CompiledArchiveDownloadButtonWrapper {...props} />
	) : (
		<EmotionArchiveDownloadButtonWrapper {...props} />
	);

export const DisabledArchiveDownloadButtonWrapper = (props: Children) =>
	fg('platform_media_compiled') ? (
		<CompiledDisabledArchiveDownloadButtonWrapper {...props} />
	) : (
		<EmotionDisabledArchiveDownloadButtonWrapper {...props} />
	);

export const SidebarItemWrapper = (props: Children) =>
	fg('platform_media_compiled') ? (
		<CompiledSidebarItemWrapper {...props} />
	) : (
		<EmotionSidebarItemWrapper {...props} />
	);

export const ArchiveSidebarFileEntryWrapper = (props: { index: Key } & Children) =>
	fg('platform_media_compiled') ? (
		<CompiledArchiveSidebarFileEntryWrapper {...props} />
	) : (
		<EmotionArchiveSidebarFileEntryWrapper {...props} />
	);

export const ArchiveLayout = (props: Children) =>
	fg('platform_media_compiled') ? (
		<CompiledArchiveLayout {...props} />
	) : (
		<EmotionArchiveLayout {...props} />
	);

export const ArchiveViewerWrapper = (props: Children) =>
	fg('platform_media_compiled') ? (
		<CompiledArchiveViewerWrapper {...props} />
	) : (
		<EmotionArchiveViewerWrapper {...props} />
	);

export const Separator = () =>
	fg('platform_media_compiled') ? <CompiledSeparator /> : <EmotionSeparator />;

export const SidebarHeaderWrapper = (props: Children) =>
	fg('platform_media_compiled') ? (
		<CompiledSidebarHeaderWrapper {...props} />
	) : (
		<EmotionSidebarHeaderWrapper {...props} />
	);

export const SidebarHeaderIcon = (props: Children) =>
	fg('platform_media_compiled') ? (
		<CompiledSidebarHeaderIcon {...props} />
	) : (
		<EmotionSidebarHeaderIcon {...props} />
	);

export const SidebarHeaderEntry = (props: Children) =>
	fg('platform_media_compiled') ? (
		<CompiledSidebarHeaderEntry {...props} />
	) : (
		<EmotionSidebarHeaderEntry {...props} />
	);
