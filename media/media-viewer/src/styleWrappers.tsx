/* eslint-disable @atlaskit/design-system/use-tokens-typography */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import {
	type CSSProperties,
	forwardRef,
	type ForwardRefExoticComponent,
	type MouseEvent,
	type ReactNode,
	type RefAttributes,
	useMemo,
} from 'react';

import { jsx, css } from '@compiled/react';
import { TouchScrollable } from 'react-scrolllock';
import { useMergeRefs } from 'use-callback-ref';

import Heading from '@atlaskit/heading/heading';
import { type MediaType } from '@atlaskit/media-client';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

import { useIsInsetViewer } from './insetViewerContext';

const INSET_HEADER_HEIGHT = token('space.800');

const blanketStyles = css({
	position: 'fixed',
	top: 0,
	left: 0,
	bottom: 0,
	right: 0,
	// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
	backgroundColor: '#22272B',
	// OVERLAY_Z_INDEX = 520;
	zIndex: 520,
	display: 'flex',
});

const insetViewerBlanketStyles = css({
	alignItems: 'center',
	justifyContent: 'center',
	backgroundColor: token('color.blanket'),
	paddingTop: token('space.300'),
	paddingRight: token('space.300'),
	paddingBottom: token('space.300'),
	paddingLeft: token('space.300'),
	boxSizing: 'border-box',
});

const blanketCloseButtonStyles = css({
	position: 'absolute',
	insetBlockStart: 0,
	insetInlineEnd: 0,
	insetBlockEnd: 0,
	insetInlineStart: 0,
	paddingTop: 0,
	paddingRight: 0,
	paddingBottom: 0,
	paddingLeft: 0,
	borderWidth: 0,
	backgroundColor: 'transparent',
	cursor: 'default',
});

const insetViewerShellStyles = css({
	display: 'flex',
	flexDirection: 'column',
	position: 'relative',
	zIndex: 1,
	width: '100%',
	height: '100%',
	minHeight: 0,
	maxHeight: '100%',
	overflow: 'hidden',
	backgroundColor: token('elevation.surface.overlay'),
	borderRadius: token('radius.xlarge'),
	boxShadow: token('elevation.shadow.overlay'),
});

const insetViewerLayoutStyles = css({
	display: 'grid',
	gridTemplateColumns: 'minmax(0, 1fr) auto',
	gridTemplateRows: `${INSET_HEADER_HEIGHT} minmax(0, 1fr)`,
	width: '100%',
	height: '100%',
	minHeight: 0,
});

const headerWrapperStyles = css({
	position: 'absolute',
	top: 0,
	left: 0,
	width: '100%',
	height: '98px',
	opacity: 0.85,
	background: `linear-gradient( to bottom, #101214, rgba(14, 22, 36, 0) ) no-repeat`,
	backgroundPosition: '0',
	// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
	color: '#c7d1db',
	fontWeight: token('font.weight.medium'),
	paddingTop: token('space.300'),
	paddingBottom: token('space.300'),
	paddingLeft: token('space.300'),
	paddingRight: token('space.300'),
	boxSizing: 'border-box',
	pointerEvents: 'none',
	// (OVERLAY_Z_INDEX = 520) + 1
	zIndex: 521,
});

const archiveHeaderWrapperStyles = css({
	// ARCHIVE_SIDE_BAR_WIDTH = 300;
	backgroundPosition: `300px 0`,
});

const insetViewerMediaColumnStyles = css({
	gridColumn: 1,
	gridRow: 2,
	display: 'flex',
	flexDirection: 'column',
	height: '100%',
	minWidth: 0,
	minHeight: 0,
	overflow: 'hidden',
});

const insetViewerMediaStageStyles = css({
	flex: 1,
	minWidth: 0,
	minHeight: 0,
	position: 'relative',
	overflow: 'hidden',
});

const listWrapperStyles = css({
	width: '100%',
	height: '100%',
	position: 'relative',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
});

const insetViewerListWrapperStyles = css({
	flexDirection: 'column',
	alignItems: 'stretch',
	justifyContent: 'flex-start',
	overflow: 'hidden',
});

const itemStageStyles = css({
	position: 'relative',
	flex: 1,
	width: '100%',
	minWidth: 0,
	minHeight: 0,
	overflow: 'hidden',
});

const insetViewerItemStageStyles = css({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
});

const closeButtonWrapperStyles = css({
	position: 'absolute',
	top: token('space.300'),
	right: token('space.250'),
	// (OVERLAY_Z_INDEX = 520) + 2
	zIndex: 522,
});

const contentWrapperStyles = css({
	width: '100%',
});

const contentWrapperStyleWithSideBar = css({
	// SideBarWidth = 416px
	width: `calc(100% - 416px)`,
});

const insetViewerContentWrapperStyles = css({
	flex: 'none',
	width: '100%',
	minWidth: 0,
	minHeight: 0,
	height: '100%',
	position: 'relative',
	overflow: 'hidden',
});

const zoomWrapperStyles = css({
	width: '100%',
	position: 'absolute',
	bottom: '0px',
	height: '98px',
	backgroundImage: `linear-gradient( to top, #101214, rgba(14, 22, 36, 0) )`,
	opacity: 0.85,
	pointerEvents: 'none',
	boxSizing: 'border-box',
	display: 'flex',
	alignItems: 'flex-end',
	paddingTop: `${token('space.100')} ${token('space.300')}`,
	paddingBottom: `${token('space.100')}`,
	paddingRight: `${token('space.300')}`,
	paddingLeft: `${token('space.300')}`,
});

const zoomCenterControlsStyles = css({
	width: '100%',
	display: 'flex',
	justifyContent: 'center',
	gap: token('space.100'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'> *': {
		pointerEvents: 'all',
	},
});

const zoomRightControlsStyles = css({
	position: 'absolute',
	right: token('space.300'),
	// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
	color: '#c7d1db',
	pointerEvents: 'all',
	display: 'flex',
	justifyContent: 'right',
	gap: token('space.100'),
});

const zoomLevelIndicatorStyles = css({
	lineHeight: '32px',
	height: '32px',
	verticalAlign: 'middle',
});

const hdIconGroupWrapperStyles = css({
	display: 'flex',
	alignItems: 'center',
	gap: token('space.100'),
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
	marginBottom: token('space.100'),
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
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,  @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	'.mvng-hide-controls': {
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
	paddingTop: token('space.250'),
	paddingBottom: token('space.250'),
	paddingLeft: token('space.250'),
	paddingRight: token('space.250'),
});

const insetViewerArrowStyles = css({
	cursor: 'pointer',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- IconButton does not expose custom background styles.
	button: {
		backgroundColor: token('color.background.input'),
		'&:hover': {
			backgroundColor: token('color.background.input.hovered'),
		},
	},
});

const insetViewerArrowWrapperStyles = css({
	paddingTop: token('space.0'),
	paddingBottom: token('space.0'),
	paddingLeft: token('space.0'),
	paddingRight: token('space.0'),
});

const insetViewerLeftWrapperStyles = css({
	left: token('space.300'),
});

const insetViewerRightWrapperStyles = css({
	right: token('space.300'),
});

const arrowsWrapperStyles = css({
	display: 'flex',
	position: 'absolute',
	top: '50%',
	transform: 'translateY(-50%)',
	left: 0,
	width: '100%',
});

const leftWrapperStyles = css({
	textAlign: 'left',
	left: '0',
});

const leftWrapperStylesWithSideBar = css({
	// ARCHIVE_SIDE_BAR_WIDTH = 300;
	left: `300px`,
});

const rightWrapperStyles = css({
	textAlign: 'right',
	right: 0,
});

const headerStyles = css({
	display: 'flex',
	paddingLeft: '0',
});

const headerStyleWithSideBar = css({
	// ARCHIVE_SIDE_BAR_WIDTH = 300;
	paddingLeft: `300px`,
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

const imgStyles = css({
	display: 'inline-block',
	verticalAlign: 'middle',
	position: 'relative',
});

const pixelatedImgStyles = css({
	imageRendering: 'pixelated',
});

const medatadataTextWrapperStyles = css({
	overflow: 'hidden',
});

const metadataWrapperStyles = css({
	display: 'flex',
});

const metadataFileNameStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- increased specificity to override Heading component
	'&& h1': {
		maxWidth: '100%',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
		font: token('font.body'),
		fontWeight: token('font.weight.medium'),
		// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
		color: '#c7d1db',
	},
});

const metadataSubTextStyles = css({
	maxWidth: '100%',
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	whiteSpace: 'nowrap',
	// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
	color: '#c7d1db',
});

const metadataIconWrapperStyles = xcss({
	paddingTop: 'space.050',
	paddingRight: 'space.150',
});

// oxlint-disable-next-line eslint/no-redeclare
export interface IconWrapperProps {
	type: MediaType;
}

const rightHeaderStyles = css({
	textAlign: 'right',
	marginRight: token('space.500'),
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
	// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
	backgroundColor: '#22272B',
	// eslint-disable-next-line @atlaskit/design-system/no-unsafe-design-token-usage
	borderRadius: token('radius.small', '3px'),
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
	color: token('color.text'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'> *': {
		transform: 'scale(2)',
	},
});

const downloadButtonWrapperStyles = css({
	marginTop: token('space.300'),
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
	// SIDEBAR_WIDTH = 416;
	width: `416px`,
	height: '100vh',
	overflow: 'hidden auto',
	backgroundColor: token('elevation.surface'),
	color: token('color.text'),
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
export const Blanket = ({
	'data-testid': datatestId,
	className,
	children,
}: BlanketProps): JSX.Element => {
	const isInsetViewer = useIsInsetViewer();
	return (
		<div
			css={[blanketStyles, isInsetViewer && insetViewerBlanketStyles]}
			data-testid={datatestId}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className={className}
			role="dialog"
			aria-modal="true"
			aria-labelledby="media.media-viewer.file.name"
		>
			{children}
		</div>
	);
};

// Mouse-only: keyboard and screen reader users close with Escape or the visible close button.
export const BlanketCloseButton = ({ onClick }: { onClick: () => void }): JSX.Element => (
	<button
		type="button"
		css={blanketCloseButtonStyles}
		aria-hidden
		tabIndex={-1}
		onClick={onClick}
	/>
);

export const InsetViewerShell = ({ children }: Children): JSX.Element => (
	<div css={insetViewerShellStyles}>{children}</div>
);

export const InsetViewerLayout = ({ children }: Children): JSX.Element => (
	<div css={insetViewerLayoutStyles}>{children}</div>
);

type HeaderWrapperProps = {
	isArchiveSideBarVisible: boolean;
};

export const HeaderWrapper: {
	({
		className,
		children,
		isArchiveSideBarVisible,
	}: ClassName & Children & HeaderWrapperProps): JSX.Element;
	displayName: string;
} = ({
	className,
	children,
	isArchiveSideBarVisible,
}: ClassName & Children & HeaderWrapperProps): JSX.Element => {
	return (
		<div
			css={[headerWrapperStyles, isArchiveSideBarVisible && archiveHeaderWrapperStyles]}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className={className}
		>
			{children}
		</div>
	);
};

HeaderWrapper.displayName = 'HeaderWrapper';

export const MediaColumn = ({ children }: Children): JSX.Element => (
	<div css={insetViewerMediaColumnStyles}>{children}</div>
);

export const MediaStage = ({ children }: Children): JSX.Element => (
	<div css={insetViewerMediaStageStyles}>{children}</div>
);

export const ListWrapper: {
	({ children }: Children): JSX.Element;
	displayName: string;
} = ({ children }: Children): JSX.Element => {
	const isInsetViewer = useIsInsetViewer();
	return (
		<div css={[listWrapperStyles, isInsetViewer && insetViewerListWrapperStyles]}>{children}</div>
	);
};
ListWrapper.displayName = 'ListWrapper';

export const ItemStage = ({ children }: Children): JSX.Element => (
	<div css={[itemStageStyles, insetViewerItemStageStyles]}>{children}</div>
);

export const ArrowsWrapper = ({ children }: Children): JSX.Element => (
	<div id="media-viewer-navigation" css={arrowsWrapperStyles}>
		{children}
	</div>
);

export const CloseButtonWrapper = ({ className, children }: ClassName & Children): JSX.Element => (
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
	<div css={closeButtonWrapperStyles} className={className}>
		{children}
	</div>
);

type ContentWrapperProps = {
	isSidebarVisible: boolean | undefined;
} & Children;

export const ContentWrapper = ({
	isSidebarVisible,
	children,
}: ContentWrapperProps): JSX.Element => {
	const isInsetViewer = useIsInsetViewer();
	return (
		<div
			css={[
				!isInsetViewer && contentWrapperStyles,
				isInsetViewer && insetViewerContentWrapperStyles,
				isSidebarVisible && !isInsetViewer && contentWrapperStyleWithSideBar,
			]}
		>
			{children}
		</div>
	);
};

export const ZoomWrapper = ({ className, children }: ClassName & Children): JSX.Element => (
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
	<div css={zoomWrapperStyles} className={className}>
		{children}
	</div>
);

export const ZoomCenterControls = ({ children }: Children): JSX.Element => (
	<div css={zoomCenterControlsStyles}>{children}</div>
);

export const ZoomRightControls = ({ children }: Children): JSX.Element => (
	<div css={zoomRightControlsStyles}>{children}</div>
);

export const ZoomLevelIndicator = ({ children }: Children): JSX.Element => (
	<span css={zoomLevelIndicatorStyles} data-testid="zoom-level-indicator">
		{children}
	</span>
);

export const HDIconGroupWrapper = ({ className, children }: ClassName & Children): JSX.Element => (
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
	<div css={hdIconGroupWrapperStyles} className={className}>
		{children}
	</div>
);

type ErrorMessageWrapperProps = DataTestID & Children;

export const ErrorMessageWrapper = ({
	'data-testid': datatestId,
	children,
}: ErrorMessageWrapperProps): JSX.Element => (
	<div css={errorMessageWrapperStyles} data-testid={datatestId}>
		{children}
	</div>
);

type ErrorImageProps = {
	alt: string | undefined;
	src: string;
};

export const ErrorImage = ({ src, alt }: ErrorImageProps): JSX.Element => (
	<img css={errorImageStyles} alt={alt} src={src} />
);

type VideoProps = {
	controls: boolean;
	src: string;
	autoPlay: boolean;
};

export const Video = ({ autoPlay, controls, src }: VideoProps): JSX.Element => (
	// eslint-disable-next-line @atlassian/a11y/media-has-caption
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
export const PDFWrapper: ForwardRefExoticComponent<
	DataTestID & Children & RefAttributes<HTMLDivElement>
> = forwardRef<HTMLDivElement, PDFWrapperProps>((props, ref) => {
	return (
		<TouchScrollable>
			<PDFWrapperBody innerRef={ref} {...props} />
		</TouchScrollable>
	);
});

export const Arrow = ({ className, children }: ClassName & Children): JSX.Element => {
	const isInsetViewer = useIsInsetViewer();
	return (
		<span
			css={[!isInsetViewer && arrowStyles, isInsetViewer && insetViewerArrowStyles]}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className={className}
		>
			{children}
		</span>
	);
};

export type LeftWrapperProps = {
	isArchiveSideBarVisible: boolean;
};

export const LeftWrapper = ({
	children,
	isArchiveSideBarVisible,
}: Children & LeftWrapperProps): JSX.Element => {
	const isInsetViewer = useIsInsetViewer();
	return (
		<div
			css={[
				arrowWrapperStyles,
				leftWrapperStyles,
				isArchiveSideBarVisible && leftWrapperStylesWithSideBar,
				isInsetViewer && insetViewerArrowWrapperStyles,
				isInsetViewer && insetViewerLeftWrapperStyles,
			]}
		>
			{children}
		</div>
	);
};

export const RightWrapper = ({ children }: Children): JSX.Element => {
	const isInsetViewer = useIsInsetViewer();
	return (
		<div
			css={[
				arrowWrapperStyles,
				rightWrapperStyles,
				isInsetViewer && insetViewerArrowWrapperStyles,
				isInsetViewer && insetViewerRightWrapperStyles,
			]}
		>
			{children}
		</div>
	);
};

// header.tsx
export type HeaderProps = {
	isArchiveSideBarVisible: boolean;
};

export const Header = ({
	children,
	isArchiveSideBarVisible,
	className,
}: Children & HeaderProps & ClassName): JSX.Element => (
	<div
		css={[headerStyles, isArchiveSideBarVisible && headerStyleWithSideBar]}
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
		className={className}
	>
		{children}
	</div>
);

export const LeftHeader = ({ children }: Children): JSX.Element => (
	<div css={leftHeaderStyles}>{children}</div>
);

export type ImageWrapperProps = {
	onClick: (event: MouseEvent<HTMLDivElement>) => void;
	style: CSSProperties;
} & Children &
	DataTestID;

export const ImageWrapper: ForwardRefExoticComponent<
	{
		onClick: (event: MouseEvent<HTMLDivElement>) => void;
		style: CSSProperties;
	} & Children &
		DataTestID &
		ClassName &
		RefAttributes<unknown>
> = forwardRef(
	(
		{
			children,
			'data-testid': datatestId,
			onClick,
			style,
			className,
		}: ImageWrapperProps & ClassName,
		ref,
	) => {
		return (
			<div
				role="none"
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
		);
	},
);

export const BaselineExtend = (): JSX.Element => <div css={baselineExtendStyles} />;

export type ImgProps = {
	canDrag: boolean;
	isDragging: boolean;
	shouldPixelate: boolean;
	src: string;
	style: CSSProperties;
	onLoad: (ev: React.SyntheticEvent<HTMLImageElement>) => void;
	onMouseDown: (ev: MouseEvent<{}>) => void;
	onError: (() => void) | undefined;
	alt?: string;
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
	alt,
	className,
	...rest
}: ImgProps): JSX.Element => {
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
			{...rest}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className={className}
			css={[imgStyles, shouldPixelate && pixelatedImgStyles]}
			alt={alt}
			data-testid={datatestId}
			src={src}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			style={{ cursor, ...style }}
			onLoad={onLoad}
			onError={onError}
		/>
	);
};

export const MedatadataTextWrapper = ({ children }: Children): JSX.Element => (
	<div css={medatadataTextWrapperStyles}>{children}</div>
);

export const MetadataWrapper = ({ children }: Children): JSX.Element => (
	<div css={metadataWrapperStyles}>{children}</div>
);

type MetadataFileNameProps = DataTestID & Children;

export const MetadataFileName = ({
	'data-testid': datatestId,
	children,
}: MetadataFileNameProps): JSX.Element => (
	<div css={metadataFileNameStyles}>
		<Heading as="h1" size="medium" id="media.media-viewer.file.name" testId={datatestId}>
			{children}
		</Heading>
	</div>
);

type MetadataSubTextProps = DataTestID & Children;

export const MetadataSubText = ({
	'data-testid': datatestId,
	children,
}: MetadataSubTextProps): JSX.Element => (
	<div css={metadataSubTextStyles} data-testid={datatestId}>
		{children}
	</div>
);

export const MetadataIconWrapper = ({ children }: Children): JSX.Element => (
	<Box xcss={metadataIconWrapperStyles}>{children}</Box>
);

export interface IconWrapperProps {
	type: MediaType;
}

export const RightHeader = ({ children }: Children): JSX.Element => (
	<div css={rightHeaderStyles}>{children}</div>
);

export const CustomAudioPlayerWrapper = ({ children }: Children): JSX.Element => (
	<div css={customAudioPlayerWrapperStyles}>{children}</div>
);

type AudioPlayerProps = DataTestID & Children;

export const AudioPlayer: {
	(props: AudioPlayerProps): JSX.Element;
	displayName: string;
} = ({ 'data-testid': datatestId, children }: AudioPlayerProps): JSX.Element => (
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

export const Audio: ForwardRefExoticComponent<AudioProps & RefAttributes<HTMLAudioElement>> =
	forwardRef<HTMLAudioElement, AudioProps>(({ autoPlay, controls, src, preload }, ref) => (
		// eslint-disable-next-line @atlassian/a11y/media-has-caption
		<audio
			css={audioStyles}
			ref={ref}
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

export const AudioCover = ({ src, alt }: AudioCoverProps): JSX.Element => (
	<img css={audioCoverStyles} alt={alt} src={src} />
);

export const DefaultCoverWrapper = ({ children }: Children): JSX.Element => (
	<div css={defaultCoverWrapperStyles}>{children}</div>
);

export const DownloadButtonWrapper = ({ children }: Children): JSX.Element => (
	<div css={downloadButtonWrapperStyles}>{children}</div>
);

type CustomVideoPlayerWrapperProps = DataTestID & Children;

export const CustomVideoPlayerWrapper = ({
	'data-testid': datatestId,
	children,
}: CustomVideoPlayerWrapperProps): JSX.Element => (
	<div css={customVideoPlayerWrapperStyles} data-testid={datatestId}>
		{children}
	</div>
);

type SidebarWrapperProps = DataTestID & Children;

export const SidebarWrapper = ({
	'data-testid': datatestId,
	children,
}: SidebarWrapperProps): JSX.Element => (
	<div css={sidebarWrapperStyles} data-testid={datatestId}>
		{children}
	</div>
);

export const SpinnerWrapper = ({ children }: Children): JSX.Element => (
	<div css={spinnerWrapperStyles}>{children}</div>
);

export const FormattedMessageWrapper = ({ children }: Children): JSX.Element => (
	<span css={formattedMessageWrapperStyles}>{children}</span>
);
