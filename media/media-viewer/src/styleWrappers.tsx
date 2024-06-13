/** @jsx jsx */
import { jsx, css } from '@emotion/react';
import { type CSSProperties, forwardRef, type MouseEvent, type ReactNode, useMemo } from 'react';
import { type MediaType } from '@atlaskit/media-client';
import { blanketColor, overlayZindex } from './styles';
import { ellipsis, hideControlsClassName } from '@atlaskit/media-ui';
import { TouchScrollable } from 'react-scrolllock';
import { useMergeRefs } from 'use-callback-ref';
import { headerAndSidebarBackgroundColor } from './viewers/modalSpinner';
import { ArchiveSideBarWidth } from './viewers/archiveSidebar/styles';
import { token } from '@atlaskit/tokens';
import { borderRadius } from '@atlaskit/theme/constants';
import { Box, xcss } from '@atlaskit/primitives';

const SIDEBAR_WIDTH = 416;

const blanketStyles = css({
	position: 'fixed',
	top: 0,
	left: 0,
	bottom: 0,
	right: 0,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	backgroundColor: blanketColor,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	zIndex: overlayZindex,
	display: 'flex',
});

const headerWrapperStyles = ({ isArchiveSideBarVisible }: HeaderWrapperProps) =>
	css({
		position: 'absolute',
		top: 0,
		left: 0,
		width: '100%',
		height: '98px',
		opacity: 0.85,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		background: `linear-gradient( to bottom, ${headerAndSidebarBackgroundColor}, rgba(14, 22, 36, 0) ) no-repeat`,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		backgroundPosition: isArchiveSideBarVisible ? `${ArchiveSideBarWidth}px 0` : '0',
		// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
		color: '#c7d1db',
		fontWeight: 500,
		padding: token('space.300', '24px'),
		boxSizing: 'border-box',
		pointerEvents: 'none',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		zIndex: overlayZindex + 1,
	});

const listWrapperStyles = css({
	width: '100%',
	height: '100%',
	position: 'relative',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
});

const closeButtonWrapperStyles = css({
	position: 'absolute',
	top: token('space.300', '24px'),
	right: token('space.250', '20px'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	zIndex: overlayZindex + 2,
});

const contentWrapperStyles = ({ isSidebarVisible }: { isSidebarVisible?: boolean }) =>
	css({
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		width: isSidebarVisible ? `calc(100% - ${SIDEBAR_WIDTH}px)` : '100%',
	});

const zoomWrapperStyles = css({
	width: '100%',
	position: 'absolute',
	bottom: '0px',
	height: '98px',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	backgroundImage: `linear-gradient( to top, ${headerAndSidebarBackgroundColor}, rgba(14, 22, 36, 0) )`,
	opacity: 0.85,
	pointerEvents: 'none',
	boxSizing: 'border-box',
	display: 'flex',
	alignItems: 'flex-end',
	padding: `${token('space.100', '10px')} ${token('space.300', '24px')}`,
});

const zoomCenterControlsStyles = css({
	width: '100%',
	display: 'flex',
	justifyContent: 'center',
	gap: token('space.100', '10px'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'> *': {
		pointerEvents: 'all',
	},
});

const zoomRightControlsStyles = css({
	position: 'absolute',
	right: token('space.300', '24px'),
	// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
	color: '#c7d1db',
	pointerEvents: 'all',
	display: 'flex',
	justifyContent: 'right',
	gap: token('space.100', '10px'),
});

const zoomLevelIndicatorStyles = css({
	height: '32px',
	lineHeight: '32px',
	verticalAlign: 'middle',
});

const hdIconGroupWrapperStyles = css({
	display: 'flex',
	alignItems: 'center',
	gap: token('space.100', '10px'),
	position: 'relative',
	width: '24px',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'> *': {
		position: 'absolute',
	},
});

const errorMessageWrapperStyles = css({
	textAlign: 'center',
	// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
	color: '#c7d1db',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	p: {
		lineHeight: '100%',
	},
});

const errorImageStyles = css({
	marginBottom: token('space.100', '10px'),
	userSelect: 'none',
});

const videoStyles = css({
	width: '100vw',
	height: '100vh',
});

const pdfWrapperStyles = css({
	overflow: 'auto',
	position: 'absolute',
	top: 0,
	left: 0,
	bottom: 0,
	right: 0,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	[`.${hideControlsClassName}`]: {
		position: 'fixed',
	},
});

const arrowStyles = css({
	cursor: 'pointer',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	svg: {
		filter:
			'drop-shadow(0px 1px 1px rgb(9 30 66 / 25%)) drop-shadow(0px 0px 1px rgb(9 30 66 / 31%))',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'&& button': {
		height: 'inherit',
		background: 'none',
		'&:hover': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
			svg: {
				// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
				color: '#b6c2cf',
			},
		},
		'&:active': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
			svg: {
				// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
				color: '#c7d1db',
			},
		},
	},
});

const arrowWrapperStyles = css({
	position: 'absolute',
	top: '50%',
	transform: 'translateY(-50%)',
	padding: token('space.250', '20px'),
});

const arrowsWrapperStyles = css({
	display: 'flex',
	position: 'absolute',
	top: '50%',
	transform: 'translateY(-50%)',
	left: 0,
	width: '100%',
});

const leftWrapperStyles = ({ isArchiveSideBarVisible }: LeftWrapperProps) =>
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	css(arrowWrapperStyles, {
		textAlign: 'left',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		left: isArchiveSideBarVisible ? `${ArchiveSideBarWidth}px` : '0',
	});

// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
const rightWrapperStyles = css(arrowWrapperStyles, {
	textAlign: 'right',
	right: 0,
});

const headerStyles = ({ isArchiveSideBarVisible }: HeaderProps) =>
	css({
		display: 'flex',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		paddingLeft: isArchiveSideBarVisible ? `${ArchiveSideBarWidth}px` : '0',
	});

const leftHeaderStyles = css({
	flex: 1,
	overflow: 'hidden',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'> *': {
		pointerEvents: 'all',
	},
});

const imageWrapperStyles = css({
	width: '100vw',
	height: '100vh',
	overflow: 'auto',
	textAlign: 'center',
	verticalAlign: 'middle',
	whiteSpace: 'nowrap',
});

const baselineExtendStyles = css({
	height: '100%',
	display: 'inline-block',
	verticalAlign: 'middle',
});

type ImgStylesProps = {
	cursor: string;
	shouldPixelate: boolean;
};

const imgStyles = ({ cursor, shouldPixelate }: ImgStylesProps) =>
	css(
		{
			display: 'inline-block',
			verticalAlign: 'middle',
			position: 'relative',
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			cursor: cursor,
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		shouldPixelate
			? `/* Prevent images from being smoothed when scaled up */
    image-rendering: optimizeSpeed; /* Legal fallback */
    image-rendering: -moz-crisp-edges; /* Firefox        */
    image-rendering: -o-crisp-edges; /* Opera          */
    image-rendering: -webkit-optimize-contrast; /* Safari         */
    image-rendering: optimize-contrast; /* CSS3 Proposed  */
    image-rendering: crisp-edges; /* CSS4 Proposed  */
    image-rendering: pixelated; /* CSS4 Proposed  */
    -ms-interpolation-mode: nearest-neighbor; /* IE8+           */`
			: ``,
	);

const medatadataTextWrapperStyles = css({
	overflow: 'hidden',
});

const metadataWrapperStyles = css({
	display: 'flex',
});

// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
const metadataFileNameStyles = css(ellipsis());

const metadataSubTextStyles = css(
	{
		// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
		color: '#c7d1db',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	ellipsis(),
);

const metadataIconWrapperStyles = xcss({
	paddingTop: 'space.050',
	paddingRight: 'space.150',
});

export interface IconWrapperProps {
	type: MediaType;
}

const rightHeaderStyles = css({
	textAlign: 'right',
	marginRight: token('space.500', '40px'),
	minWidth: '200px',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'> *': {
		pointerEvents: 'all',
	},
});

const customAudioPlayerWrapperStyles = css({
	position: 'absolute',
	bottom: 0,
	left: 0,
	width: '100%',
});

const audioPlayerStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	backgroundColor: blanketColor,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	borderRadius: borderRadius(),
	alignItems: 'center',
	justifyContent: 'center',
	width: '400px',
	height: '400px',
	overflow: 'hidden',
	display: 'flex',
	flexDirection: 'column',
	position: 'relative',
});

const audioStyles = css({
	width: '100%',
	position: 'absolute',
	bottom: 0,
	left: 0,
});

const audioCoverStyles = css({
	width: '100%',
	height: '100%',
	objectFit: 'scale-down',
	// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
	backgroundColor: '#000',
});

const defaultCoverWrapperStyles = css({
	width: '100%',
	height: '100%',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'> *': {
		transform: 'scale(2)',
	},
});

const downloadButtonWrapperStyles = css({
	marginTop: token('space.300', '28px'),
	textAlign: 'center',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	button: {
		'&:hover, &:active': {
			// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage, @atlaskit/ui-styling-standard/no-important-styles -- Ignored via go/DSP-18766
			color: '#161a1d !important',
		},
	},
});

const customVideoPlayerWrapperStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	video: {
		flex: 1,
		width: '100vw',
		height: '100vh',
		maxHeight: '100vh',
	},
});

const sidebarWrapperStyles = css({
	top: 0,
	right: 0,
	width: `${SIDEBAR_WIDTH}px`,
	height: '100vh',
	overflow: 'hidden auto',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	backgroundColor: token('elevation.surface', headerAndSidebarBackgroundColor),
	color: token('color.text', '#c7d1db'),
});

const spinnerWrapperStyles = css({
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	height: '100%',
});

const formattedMessageWrapperStyles = css({});

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
export const Blanket = ({ 'data-testid': datatestId, className, children }: BlanketProps) => (
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
	<div css={blanketStyles} data-testid={datatestId} className={className}>
		{children}
	</div>
);

type HeaderWrapperProps = {
	isArchiveSideBarVisible: boolean;
};

export const HeaderWrapper = ({
	className,
	children,
	isArchiveSideBarVisible,
}: ClassName & Children & HeaderWrapperProps) => {
	return (
		<div
			// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
			css={headerWrapperStyles({ isArchiveSideBarVisible })}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className={className}
		>
			{children}
		</div>
	);
};

HeaderWrapper.displayName = 'HeaderWrapper';

export const ListWrapper = ({ children }: Children) => (
	<div css={listWrapperStyles}>{children}</div>
);
ListWrapper.displayName = 'ListWrapper';

export const ArrowsWrapper = ({ children }: Children) => (
	<div id="media-viewer-navigation" css={arrowsWrapperStyles}>
		{children}
	</div>
);

export const CloseButtonWrapper = ({ className, children }: ClassName & Children) => (
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
	<div css={closeButtonWrapperStyles} className={className}>
		{children}
	</div>
);

type ContentWrapperProps = {
	isSidebarVisible: boolean | undefined;
} & Children;

export const ContentWrapper = ({ isSidebarVisible, children }: ContentWrapperProps) => (
	// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
	<div css={contentWrapperStyles({ isSidebarVisible })}>{children}</div>
);

export const ZoomWrapper = ({ className, children }: ClassName & Children) => (
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
	<div css={zoomWrapperStyles} className={className}>
		{children}
	</div>
);

export const ZoomCenterControls = ({ children }: Children) => (
	<div css={zoomCenterControlsStyles}>{children}</div>
);

export const ZoomRightControls = ({ children }: Children) => (
	<div css={zoomRightControlsStyles}>{children}</div>
);

export const ZoomLevelIndicator = ({ children }: Children) => (
	<span css={zoomLevelIndicatorStyles}>{children}</span>
);

export const HDIconGroupWrapper = ({ className, children }: ClassName & Children) => (
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
	<div css={hdIconGroupWrapperStyles} className={className}>
		{children}
	</div>
);

type ErrorMessageWrapperProps = DataTestID & Children;

export const ErrorMessageWrapper = ({
	'data-testid': datatestId,
	children,
}: ErrorMessageWrapperProps) => (
	<div css={errorMessageWrapperStyles} data-testid={datatestId}>
		{children}
	</div>
);

type ErrorImageProps = {
	alt: string | undefined;
	src: string;
};

export const ErrorImage = ({ src, alt }: ErrorImageProps) => (
	<img css={errorImageStyles} alt={alt} src={src} />
);

type VideoProps = {
	controls: boolean;
	src: string;
	autoPlay: boolean;
};

export const Video = ({ autoPlay, controls, src }: VideoProps) => (
	// eslint-disable-next-line jsx-a11y/media-has-caption
	<video css={videoStyles} autoPlay={autoPlay} controls={controls} src={src} />
);

const PDFWrapperBody = forwardRef<
	HTMLDivElement,
	{ innerRef: React.Ref<HTMLDivElement> } & PDFWrapperProps
>(({ innerRef, 'data-testid': datatestId, children }, ref) => {
	const bodyRef = useMergeRefs([ref, innerRef]);
	return (
		<div css={pdfWrapperStyles} ref={bodyRef} data-testid={datatestId}>
			{children}
		</div>
	);
});

type PDFWrapperProps = DataTestID & Children;
export const PDFWrapper = forwardRef<HTMLDivElement, PDFWrapperProps>((props, ref) => {
	return (
		<TouchScrollable>
			<PDFWrapperBody innerRef={ref} {...props} />
		</TouchScrollable>
	);
});

export const Arrow = ({ className, children }: ClassName & Children) => (
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
	<span css={arrowStyles} className={className}>
		{children}
	</span>
);

export type LeftWrapperProps = {
	isArchiveSideBarVisible: boolean;
};

export const LeftWrapper = ({ children, isArchiveSideBarVisible }: Children & LeftWrapperProps) => (
	// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
	<div css={leftWrapperStyles({ isArchiveSideBarVisible })}>{children}</div>
);

export const RightWrapper = ({ children }: Children) => (
	<div css={rightWrapperStyles}>{children}</div>
);

// header.tsx
export type HeaderProps = {
	isArchiveSideBarVisible: boolean;
};

export const Header = ({
	children,
	isArchiveSideBarVisible,
	className,
}: Children & HeaderProps & ClassName) => (
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
	<div css={headerStyles({ isArchiveSideBarVisible })} className={className}>
		{children}
	</div>
);

export const LeftHeader = ({ children }: Children) => <div css={leftHeaderStyles}>{children}</div>;

export type ImageWrapperProps = {
	onClick: (event: MouseEvent<HTMLDivElement>) => void;
	style: CSSProperties;
} & Children &
	DataTestID;

export const ImageWrapper = forwardRef(
	(
		{
			children,
			'data-testid': datatestId,
			onClick,
			style,
			className,
		}: ImageWrapperProps & ClassName,
		ref,
	) => (
		<div
			data-testid={datatestId}
			onClick={onClick}
			ref={ref as React.RefObject<HTMLDivElement>}
			css={imageWrapperStyles}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			style={style}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className={className}
		>
			{children}
		</div>
	),
);

export const BaselineExtend = () => <div css={baselineExtendStyles} />;

export type ImgProps = {
	canDrag: boolean;
	isDragging: boolean;
	shouldPixelate: boolean;
	src: string;
	style: CSSProperties;
	onLoad: (ev: React.SyntheticEvent<HTMLImageElement>) => void;
	onMouseDown: (ev: MouseEvent<{}>) => void;
	onError: (() => void) | undefined;
} & DataTestID &
	ClassName;

export const Img = ({
	canDrag,
	isDragging,
	shouldPixelate,
	'data-testid': datatestId,
	src,
	style,
	onLoad,
	onError,
	onMouseDown,
	className,
}: ImgProps) => {
	const cursor = useMemo(() => {
		if (canDrag && isDragging) {
			return 'grabbing';
		} else if (canDrag) {
			return 'grab';
		} else {
			return 'auto';
		}
	}, [canDrag, isDragging]);
	return (
		<img
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className={className}
			// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
			css={imgStyles({ cursor, shouldPixelate })}
			data-testid={datatestId}
			src={src}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			style={style}
			onLoad={onLoad}
			onError={onError}
			onMouseDown={onMouseDown}
		/>
	);
};

export const MedatadataTextWrapper = ({ children }: Children) => (
	<div css={medatadataTextWrapperStyles}>{children}</div>
);

export const MetadataWrapper = ({ children }: Children) => (
	<div css={metadataWrapperStyles}>{children}</div>
);

type MetadataFileNameProps = DataTestID & Children;

export const MetadataFileName = ({
	'data-testid': datatestId,
	children,
}: MetadataFileNameProps) => (
	<div css={metadataFileNameStyles} data-testid={datatestId}>
		{children}
	</div>
);

type MetadataSubTextProps = DataTestID & Children;

export const MetadataSubText = ({ 'data-testid': datatestId, children }: MetadataSubTextProps) => (
	<div css={metadataSubTextStyles} data-testid={datatestId}>
		{children}
	</div>
);

export const MetadataIconWrapper = ({ children }: Children) => (
	<Box xcss={metadataIconWrapperStyles}>{children}</Box>
);

export interface IconWrapperProps {
	type: MediaType;
}

export const RightHeader = ({ children }: Children) => (
	<div css={rightHeaderStyles}>{children}</div>
);

export const CustomAudioPlayerWrapper = ({ children }: Children) => (
	<div css={customAudioPlayerWrapperStyles}>{children}</div>
);

type AudioPlayerProps = DataTestID & Children;

export const AudioPlayer = ({ 'data-testid': datatestId, children }: AudioPlayerProps) => (
	<div css={audioPlayerStyles} data-testid={datatestId}>
		{children}
	</div>
);

AudioPlayer.displayName = 'AudioPlayer';

type AudioProps = {
	autoPlay: boolean;
	controls: boolean;
	src: string | undefined;
	preload: string;
};

export const Audio = forwardRef(({ autoPlay, controls, src, preload }: AudioProps, ref) => (
	// eslint-disable-next-line jsx-a11y/media-has-caption
	<audio
		css={audioStyles}
		ref={ref as React.RefObject<HTMLAudioElement>}
		autoPlay={autoPlay}
		controls={controls}
		src={src}
		preload={preload}
	/>
));

type AudioCoverProps = {
	alt: string | undefined;
	src: string;
};

export const AudioCover = ({ src, alt }: AudioCoverProps) => (
	<img css={audioCoverStyles} alt={alt} src={src} />
);

export const DefaultCoverWrapper = ({ children }: Children) => (
	<div css={defaultCoverWrapperStyles}>{children}</div>
);

export const DownloadButtonWrapper = ({ children }: Children) => (
	<div css={downloadButtonWrapperStyles}>{children}</div>
);

type CustomVideoPlayerWrapperProps = DataTestID & Children;

export const CustomVideoPlayerWrapper = ({
	'data-testid': datatestId,
	children,
}: CustomVideoPlayerWrapperProps) => (
	<div css={customVideoPlayerWrapperStyles} data-testid={datatestId}>
		{children}
	</div>
);

type SidebarWrapperProps = DataTestID & Children;

export const SidebarWrapper = ({ 'data-testid': datatestId, children }: SidebarWrapperProps) => (
	<div css={sidebarWrapperStyles} data-testid={datatestId}>
		{children}
	</div>
);

export const SpinnerWrapper = ({ children }: Children) => (
	<div css={spinnerWrapperStyles}>{children}</div>
);

export const FormattedMessageWrapper = ({ children }: Children) => (
	<span css={formattedMessageWrapperStyles}>{children}</span>
);
