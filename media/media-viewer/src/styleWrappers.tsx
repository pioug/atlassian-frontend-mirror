import React, { type CSSProperties, forwardRef, type MouseEvent, type ReactNode } from 'react';
import { fg } from '@atlaskit/platform-feature-flags';
import { type MediaType } from '@atlaskit/media-client';
import {
	Blanket as CompiledBlanket,
	HeaderWrapper as CompiledHeaderWrapper,
	ListWrapper as CompiledListWrapper,
	ArrowsWrapper as CompiledArrowsWrapper,
	CloseButtonWrapper as CompiledCloseButtonWrapper,
	ContentWrapper as CompiledContentWrapper,
	ZoomWrapper as CompiledZoomWrapper,
	ZoomCenterControls as CompiledZoomCenterControls,
	ZoomRightControls as CompiledZoomRightControls,
	ZoomLevelIndicator as CompiledZoomLevelIndicator,
	HDIconGroupWrapper as CompiledHDIconGroupWrapper,
	ErrorMessageWrapper as CompiledErrorMessageWrapper,
	ErrorImage as CompiledErrorImage,
	Video as CompiledVideo,
	PDFWrapper as CompiledPDFWrapper,
	Arrow as CompiledArrow,
	LeftWrapper as CompiledLeftWrapper,
	RightWrapper as CompiledRightWrapper,
	Header as CompiledHeader,
	LeftHeader as CompiledLeftHeader,
	ImageWrapper as CompiledImageWrapper,
	BaselineExtend as CompiledBaselineExtend,
	Img as CompiledImg,
	MedatadataTextWrapper as CompiledMedatadataTextWrapper,
	MetadataWrapper as CompiledMetadataWrapper,
	MetadataFileName as CompiledMetadataFileName,
	MetadataSubText as CompiledMetadataSubText,
	MetadataIconWrapper as CompiledMetadataIconWrapper,
	RightHeader as CompiledRightHeader,
	CustomAudioPlayerWrapper as CompiledCustomAudioPlayerWrapper,
	AudioPlayer as CompiledAudioPlayer,
	Audio as CompiledAudio,
	AudioCover as CompiledAudioCover,
	DefaultCoverWrapper as CompiledDefaultCoverWrapper,
	DownloadButtonWrapper as CompiledDownloadButtonWrapper,
	CustomVideoPlayerWrapper as CompiledCustomVideoPlayerWrapper,
	SidebarWrapper as CompiledSidebarWrapper,
	SpinnerWrapper as CompiledSpinnerWrapper,
	FormattedMessageWrapper as CompiledFormattedMessageWrapper,
} from './styleWrappers-compiled';

import {
	Blanket as EmotionBlanket,
	HeaderWrapper as EmotionHeaderWrapper,
	ListWrapper as EmotionListWrapper,
	ArrowsWrapper as EmotionArrowsWrapper,
	CloseButtonWrapper as EmotionCloseButtonWrapper,
	ContentWrapper as EmotionContentWrapper,
	ZoomWrapper as EmotionZoomWrapper,
	ZoomCenterControls as EmotionZoomCenterControls,
	ZoomRightControls as EmotionZoomRightControls,
	ZoomLevelIndicator as EmotionZoomLevelIndicator,
	HDIconGroupWrapper as EmotionHDIconGroupWrapper,
	ErrorMessageWrapper as EmotionErrorMessageWrapper,
	ErrorImage as EmotionErrorImage,
	Video as EmotionVideo,
	PDFWrapper as EmotionPDFWrapper,
	Arrow as EmotionArrow,
	LeftWrapper as EmotionLeftWrapper,
	RightWrapper as EmotionRightWrapper,
	Header as EmotionHeader,
	LeftHeader as EmotionLeftHeader,
	ImageWrapper as EmotionImageWrapper,
	BaselineExtend as EmotionBaselineExtend,
	Img as EmotionImg,
	MedatadataTextWrapper as EmotionMedatadataTextWrapper,
	MetadataWrapper as EmotionMetadataWrapper,
	MetadataFileName as EmotionMetadataFileName,
	MetadataSubText as EmotionMetadataSubText,
	MetadataIconWrapper as EmotionMetadataIconWrapper,
	RightHeader as EmotionRightHeader,
	CustomAudioPlayerWrapper as EmotionCustomAudioPlayerWrapper,
	AudioPlayer as EmotionAudioPlayer,
	Audio as EmotionAudio,
	AudioCover as EmotionAudioCover,
	DefaultCoverWrapper as EmotionDefaultCoverWrapper,
	DownloadButtonWrapper as EmotionDownloadButtonWrapper,
	CustomVideoPlayerWrapper as EmotionCustomVideoPlayerWrapper,
	SidebarWrapper as EmotionSidebarWrapper,
	SpinnerWrapper as EmotionSpinnerWrapper,
	FormattedMessageWrapper as EmotionFormattedMessageWrapper,
} from './styleWrappers-emotion';
export interface IconWrapperProps {
	type: MediaType;
}

type Children = {
	children: ReactNode;
};
type ClassName = {
	className: string;
};

type DataTestID = {
	'data-testid'?: string | undefined;
};

type BlanketProps = DataTestID & Children & ClassName;
// We are keeping this data-testid since JIRA is still using it in their codebase to perform checks. Before removing this, we need to ensure this 'media-viewer-popup' test id is not being used anywhere else in other codebases
export const Blanket = (props: BlanketProps) =>
	fg('platform_media_compiled') ? <CompiledBlanket {...props} /> : <EmotionBlanket {...props} />;

type HeaderWrapperProps = {
	isArchiveSideBarVisible: boolean;
};

export const HeaderWrapper = (props: ClassName & Children & HeaderWrapperProps) =>
	fg('platform_media_compiled') ? (
		<CompiledHeaderWrapper {...props} />
	) : (
		<EmotionHeaderWrapper {...props} />
	);

HeaderWrapper.displayName = 'HeaderWrapper';

export const ListWrapper = (props: Children) =>
	fg('platform_media_compiled') ? (
		<CompiledListWrapper {...props} />
	) : (
		<EmotionListWrapper {...props} />
	);

ListWrapper.displayName = 'ListWrapper';

export const ArrowsWrapper = (props: Children) =>
	fg('platform_media_compiled') ? (
		<CompiledArrowsWrapper {...props} />
	) : (
		<EmotionArrowsWrapper {...props} />
	);

export const CloseButtonWrapper = (props: ClassName & Children) =>
	fg('platform_media_compiled') ? (
		<CompiledCloseButtonWrapper {...props} />
	) : (
		<EmotionCloseButtonWrapper {...props} />
	);

type ContentWrapperProps = {
	isSidebarVisible: boolean | undefined;
} & Children;

export const ContentWrapper = (props: ContentWrapperProps) =>
	fg('platform_media_compiled') ? (
		<CompiledContentWrapper {...props} />
	) : (
		<EmotionContentWrapper {...props} />
	);

export const ZoomWrapper = (props: ClassName & Children) =>
	fg('platform_media_compiled') ? (
		<CompiledZoomWrapper {...props} />
	) : (
		<EmotionZoomWrapper {...props} />
	);

export const ZoomCenterControls = (props: Children) =>
	fg('platform_media_compiled') ? (
		<CompiledZoomCenterControls {...props} />
	) : (
		<EmotionZoomCenterControls {...props} />
	);

export const ZoomRightControls = (props: Children) =>
	fg('platform_media_compiled') ? (
		<CompiledZoomRightControls {...props} />
	) : (
		<EmotionZoomRightControls {...props} />
	);

export const ZoomLevelIndicator = (props: Children) =>
	fg('platform_media_compiled') ? (
		<CompiledZoomLevelIndicator {...props} data-testid="zoom-level-indicator" />
	) : (
		<EmotionZoomLevelIndicator {...props} data-testid="zoom-level-indicator" />
	);

export const HDIconGroupWrapper = (props: ClassName & Children) =>
	fg('platform_media_compiled') ? (
		<CompiledHDIconGroupWrapper {...props} />
	) : (
		<EmotionHDIconGroupWrapper {...props} />
	);

type ErrorMessageWrapperProps = DataTestID & Children;

export const ErrorMessageWrapper = (props: ErrorMessageWrapperProps) =>
	fg('platform_media_compiled') ? (
		<CompiledErrorMessageWrapper {...props} />
	) : (
		<EmotionErrorMessageWrapper {...props} />
	);

type ErrorImageProps = {
	alt: string | undefined;
	src: string;
};

export const ErrorImage = (props: ErrorImageProps) =>
	fg('platform_media_compiled') ? (
		<CompiledErrorImage {...props} />
	) : (
		<EmotionErrorImage {...props} />
	);

type VideoProps = {
	controls: boolean;
	src: string;
	autoPlay: boolean;
};

export const Video = (props: VideoProps) =>
	fg('platform_media_compiled') ? <CompiledVideo {...props} /> : <EmotionVideo {...props} />;

type PDFWrapperProps = DataTestID & Children;
export const PDFWrapper = forwardRef<HTMLDivElement, PDFWrapperProps>((props, ref) =>
	fg('platform_media_compiled') ? (
		<CompiledPDFWrapper ref={ref} {...props} />
	) : (
		<EmotionPDFWrapper ref={ref} {...props} />
	),
);

export const Arrow = (props: ClassName & Children) =>
	fg('platform_media_compiled') ? <CompiledArrow {...props} /> : <EmotionArrow {...props} />;

export type LeftWrapperProps = {
	isArchiveSideBarVisible: boolean;
};

export const LeftWrapper = (props: Children & LeftWrapperProps) =>
	fg('platform_media_compiled') ? (
		<CompiledLeftWrapper {...props} />
	) : (
		<EmotionLeftWrapper {...props} />
	);

export const RightWrapper = (props: Children) =>
	fg('platform_media_compiled') ? (
		<CompiledRightWrapper {...props} />
	) : (
		<EmotionRightWrapper {...props} />
	);

// header.tsx
export type HeaderProps = {
	isArchiveSideBarVisible: boolean;
};

export const Header = (props: Children & HeaderProps & ClassName) =>
	fg('platform_media_compiled') ? <CompiledHeader {...props} /> : <EmotionHeader {...props} />;

export const LeftHeader = (props: Children) =>
	fg('platform_media_compiled') ? (
		<CompiledLeftHeader {...props} />
	) : (
		<EmotionLeftHeader {...props} />
	);

export type ImageWrapperProps = {
	onClick: (event: MouseEvent<HTMLDivElement>) => void;
	style: CSSProperties;
} & Children &
	DataTestID;

export const ImageWrapper = forwardRef<HTMLDivElement, ImageWrapperProps & ClassName>(
	(props, ref) =>
		fg('platform_media_compiled') ? (
			<CompiledImageWrapper ref={ref} {...props} />
		) : (
			<EmotionImageWrapper ref={ref} {...props} />
		),
);

export const BaselineExtend = () =>
	fg('platform_media_compiled') ? <CompiledBaselineExtend /> : <EmotionBaselineExtend />;

export type ImgProps = {
	canDrag: boolean;
	isDragging: boolean;
	shouldPixelate: boolean;
	src: string;
	style: CSSProperties;
	onLoad: (ev: React.SyntheticEvent<HTMLImageElement>) => void;
	onMouseDown: (ev: MouseEvent<{}>) => void;
	onError: (() => void) | undefined;
	alt: string;
} & DataTestID &
	ClassName;

export const Img = (props: ImgProps) =>
	fg('platform_media_compiled') ? <CompiledImg {...props} /> : <EmotionImg {...props} />;

export const MedatadataTextWrapper = (props: Children) =>
	fg('platform_media_compiled') ? (
		<CompiledMedatadataTextWrapper {...props} />
	) : (
		<EmotionMedatadataTextWrapper {...props} />
	);

export const MetadataWrapper = (props: Children) =>
	fg('platform_media_compiled') ? (
		<CompiledMetadataWrapper {...props} />
	) : (
		<EmotionMetadataWrapper {...props} />
	);

type MetadataFileNameProps = DataTestID & Children;

export const MetadataFileName = (props: MetadataFileNameProps) =>
	fg('platform_media_compiled') ? (
		<CompiledMetadataFileName {...props} />
	) : (
		<EmotionMetadataFileName {...props} />
	);

type MetadataSubTextProps = DataTestID & Children;

export const MetadataSubText = (props: MetadataSubTextProps) =>
	fg('platform_media_compiled') ? (
		<CompiledMetadataSubText {...props} />
	) : (
		<EmotionMetadataSubText {...props} />
	);

export const MetadataIconWrapper = (props: Children) =>
	fg('platform_media_compiled') ? (
		<CompiledMetadataIconWrapper {...props} />
	) : (
		<EmotionMetadataIconWrapper {...props} />
	);

export interface IconWrapperProps {
	type: MediaType;
}

export const RightHeader = (props: Children) =>
	fg('platform_media_compiled') ? (
		<CompiledRightHeader {...props} />
	) : (
		<EmotionRightHeader {...props} />
	);

export const CustomAudioPlayerWrapper = (props: Children) =>
	fg('platform_media_compiled') ? (
		<CompiledCustomAudioPlayerWrapper {...props} />
	) : (
		<EmotionCustomAudioPlayerWrapper {...props} />
	);

type AudioPlayerProps = DataTestID & Children;

export const AudioPlayer = (props: AudioPlayerProps) =>
	fg('platform_media_compiled') ? (
		<CompiledAudioPlayer {...props} />
	) : (
		<EmotionAudioPlayer {...props} />
	);

AudioPlayer.displayName = 'AudioPlayer';

type AudioProps = {
	autoPlay: boolean;
	controls: boolean;
	src: string | undefined;
	preload: string;
};

export const Audio = forwardRef<HTMLAudioElement, AudioProps>((props, ref) =>
	fg('platform_media_compiled') ? (
		<CompiledAudio ref={ref} {...props} />
	) : (
		<EmotionAudio ref={ref} {...props} />
	),
);

type AudioCoverProps = {
	alt: string | undefined;
	src: string;
};

export const AudioCover = (props: AudioCoverProps) =>
	fg('platform_media_compiled') ? (
		<CompiledAudioCover {...props} />
	) : (
		<EmotionAudioCover {...props} />
	);

export const DefaultCoverWrapper = (props: Children) =>
	fg('platform_media_compiled') ? (
		<CompiledDefaultCoverWrapper {...props} />
	) : (
		<EmotionDefaultCoverWrapper {...props} />
	);

export const DownloadButtonWrapper = (props: Children) =>
	fg('platform_media_compiled') ? (
		<CompiledDownloadButtonWrapper {...props} />
	) : (
		<EmotionDownloadButtonWrapper {...props} />
	);

type CustomVideoPlayerWrapperProps = DataTestID & Children;

export const CustomVideoPlayerWrapper = (props: CustomVideoPlayerWrapperProps) =>
	fg('platform_media_compiled') ? (
		<CompiledCustomVideoPlayerWrapper {...props} />
	) : (
		<EmotionCustomVideoPlayerWrapper {...props} />
	);

type SidebarWrapperProps = DataTestID & Children;

export const SidebarWrapper = (props: SidebarWrapperProps) =>
	fg('platform_media_compiled') ? (
		<CompiledSidebarWrapper {...props} />
	) : (
		<EmotionSidebarWrapper {...props} />
	);

export const SpinnerWrapper = (props: Children) =>
	fg('platform_media_compiled') ? (
		<CompiledSpinnerWrapper {...props} />
	) : (
		<EmotionSpinnerWrapper {...props} />
	);

export const FormattedMessageWrapper = (props: Children) =>
	fg('platform_media_compiled') ? (
		<CompiledFormattedMessageWrapper {...props} />
	) : (
		<EmotionFormattedMessageWrapper {...props} />
	);
