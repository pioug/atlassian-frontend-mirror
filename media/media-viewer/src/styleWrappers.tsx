import React, { type CSSProperties, forwardRef, type MouseEvent, type ReactNode } from 'react';
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
export const Blanket = (props: BlanketProps): React.JSX.Element => <CompiledBlanket {...props} />;

type HeaderWrapperProps = {
	isArchiveSideBarVisible: boolean;
};

export const HeaderWrapper: {
	(props: ClassName & Children & HeaderWrapperProps): React.JSX.Element;
	displayName: string;
} = (props: ClassName & Children & HeaderWrapperProps): React.JSX.Element => (
	<CompiledHeaderWrapper {...props} />
);

HeaderWrapper.displayName = 'HeaderWrapper';

export const ListWrapper: {
	(props: Children): React.JSX.Element;
	displayName: string;
} = (props: Children): React.JSX.Element => <CompiledListWrapper {...props} />;

ListWrapper.displayName = 'ListWrapper';

export const ArrowsWrapper = (props: Children): React.JSX.Element => (
	<CompiledArrowsWrapper {...props} />
);

export const CloseButtonWrapper = (props: ClassName & Children): React.JSX.Element => (
	<CompiledCloseButtonWrapper {...props} />
);

type ContentWrapperProps = {
	isSidebarVisible: boolean | undefined;
} & Children;

export const ContentWrapper = (props: ContentWrapperProps): React.JSX.Element => (
	<CompiledContentWrapper {...props} />
);

export const ZoomWrapper = (props: ClassName & Children): React.JSX.Element => (
	<CompiledZoomWrapper {...props} />
);

export const ZoomCenterControls = (props: Children): React.JSX.Element => (
	<CompiledZoomCenterControls {...props} />
);

export const ZoomRightControls = (props: Children): React.JSX.Element => (
	<CompiledZoomRightControls {...props} />
);

export const ZoomLevelIndicator = (props: Children): React.JSX.Element => (
	<CompiledZoomLevelIndicator {...props} data-testid="zoom-level-indicator" />
);

export const HDIconGroupWrapper = (props: ClassName & Children): React.JSX.Element => (
	<CompiledHDIconGroupWrapper {...props} />
);

type ErrorMessageWrapperProps = DataTestID & Children;

export const ErrorMessageWrapper = (props: ErrorMessageWrapperProps): React.JSX.Element => (
	<CompiledErrorMessageWrapper {...props} />
);

type ErrorImageProps = {
	alt: string | undefined;
	src: string;
};

export const ErrorImage = (props: ErrorImageProps): React.JSX.Element => (
	<CompiledErrorImage {...props} />
);

type VideoProps = {
	controls: boolean;
	src: string;
	autoPlay: boolean;
};

export const Video = (props: VideoProps): React.JSX.Element => <CompiledVideo {...props} />;

type PDFWrapperProps = DataTestID & Children;
export const PDFWrapper = forwardRef<HTMLDivElement, PDFWrapperProps>((props, ref) => (
	<CompiledPDFWrapper ref={ref} {...props} />
));

export const Arrow = (props: ClassName & Children): React.JSX.Element => (
	<CompiledArrow {...props} />
);

export type LeftWrapperProps = {
	isArchiveSideBarVisible: boolean;
};

export const LeftWrapper = (props: Children & LeftWrapperProps): React.JSX.Element => (
	<CompiledLeftWrapper {...props} />
);

export const RightWrapper = (props: Children): React.JSX.Element => (
	<CompiledRightWrapper {...props} />
);

// header.tsx
export type HeaderProps = {
	isArchiveSideBarVisible: boolean;
};

export const Header = (props: Children & HeaderProps & ClassName): React.JSX.Element => (
	<CompiledHeader {...props} />
);

export const LeftHeader = (props: Children): React.JSX.Element => <CompiledLeftHeader {...props} />;

export type ImageWrapperProps = {
	onClick: (event: MouseEvent<HTMLDivElement>) => void;
	style: CSSProperties;
} & Children &
	DataTestID;

export const ImageWrapper = forwardRef<HTMLDivElement, ImageWrapperProps & ClassName>(
	(props, ref) => <CompiledImageWrapper ref={ref} {...props} />,
);

export const BaselineExtend = (): React.JSX.Element => <CompiledBaselineExtend />;

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

export const Img = (props: ImgProps): React.JSX.Element => <CompiledImg {...props} />;

export const MedatadataTextWrapper = (props: Children): React.JSX.Element => (
	<CompiledMedatadataTextWrapper {...props} />
);

export const MetadataWrapper = (props: Children): React.JSX.Element => (
	<CompiledMetadataWrapper {...props} />
);

type MetadataFileNameProps = DataTestID & Children;

export const MetadataFileName = (props: MetadataFileNameProps): React.JSX.Element => (
	<CompiledMetadataFileName {...props} />
);

type MetadataSubTextProps = DataTestID & Children;

export const MetadataSubText = (props: MetadataSubTextProps): React.JSX.Element => (
	<CompiledMetadataSubText {...props} />
);

export const MetadataIconWrapper = (props: Children): React.JSX.Element => (
	<CompiledMetadataIconWrapper {...props} />
);

export interface IconWrapperProps {
	type: MediaType;
}

export const RightHeader = (props: Children): React.JSX.Element => (
	<CompiledRightHeader {...props} />
);

export const CustomAudioPlayerWrapper = (props: Children): React.JSX.Element => (
	<CompiledCustomAudioPlayerWrapper {...props} />
);

type AudioPlayerProps = DataTestID & Children;

export const AudioPlayer: {
	(props: AudioPlayerProps): React.JSX.Element;
	displayName: string;
} = (props: AudioPlayerProps): React.JSX.Element => <CompiledAudioPlayer {...props} />;

AudioPlayer.displayName = 'AudioPlayer';

type AudioProps = {
	autoPlay: boolean;
	controls: boolean;
	src: string | undefined;
	preload: string;
};

export const Audio = forwardRef<HTMLAudioElement, AudioProps>((props, ref) => (
	<CompiledAudio ref={ref} {...props} />
));

type AudioCoverProps = {
	alt: string | undefined;
	src: string;
};

export const AudioCover = (props: AudioCoverProps): React.JSX.Element => (
	<CompiledAudioCover {...props} />
);

export const DefaultCoverWrapper = (props: Children): React.JSX.Element => (
	<CompiledDefaultCoverWrapper {...props} />
);

export const DownloadButtonWrapper = (props: Children): React.JSX.Element => (
	<CompiledDownloadButtonWrapper {...props} />
);

type CustomVideoPlayerWrapperProps = DataTestID & Children;

export const CustomVideoPlayerWrapper = (
	props: CustomVideoPlayerWrapperProps,
): React.JSX.Element => <CompiledCustomVideoPlayerWrapper {...props} />;

type SidebarWrapperProps = DataTestID & Children;

export const SidebarWrapper = (props: SidebarWrapperProps): React.JSX.Element => (
	<CompiledSidebarWrapper {...props} />
);

export const SpinnerWrapper = (props: Children): React.JSX.Element => (
	<CompiledSpinnerWrapper {...props} />
);

export const FormattedMessageWrapper = (props: Children): React.JSX.Element => (
	<CompiledFormattedMessageWrapper {...props} />
);
