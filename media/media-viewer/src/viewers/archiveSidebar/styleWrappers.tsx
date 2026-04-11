/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import {
	type ReactNode,
	type MouseEvent,
	type Key,
	forwardRef,
	type ForwardRefExoticComponent,
	type RefAttributes,
} from 'react';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx, css, keyframes } from '@compiled/react';
import { token } from '@atlaskit/tokens';
import { useIntl } from 'react-intl-next';
import { messages } from '@atlaskit/media-ui';
import { fg } from '@atlaskit/platform-feature-flags';

export const ARCHIVE_SIDE_BAR_WIDTH = 300;

const archiveItemViewerWrapperStyles = css({
	width: '100%',
	display: 'flex',
	justifyContent: 'center',
});

const archiveSideBarStyles = css({
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
	paddingTop: '22px',
	paddingRight: `${token('space.250')}`,
	paddingLeft: `${token('space.250')}`,
	paddingBottom: `${token('space.250')}`,
	backgroundColor: token('elevation.surface'),
	position: 'absolute',
	left: 0,
	top: 0,
	width: `${ARCHIVE_SIDE_BAR_WIDTH}px`,
	bottom: 0,
	boxSizing: 'border-box',
	overflowY: 'scroll',
});

const slideDown = keyframes({
	'0%': {
		opacity: 0,
		transform: 'translateY(-100%)',
	},
	'100%': {
		transform: 'translateY(0)',
		opacity: 1,
	},
});

const archiveDownloadButtonWrapperStyles = css({
	paddingTop: `${token('space.100')}`,
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
	paddingRight: '7px',
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
	paddingBottom: '5px',
	paddingLeft: `${token('space.100')}`,
	border: 'none',
	// eslint-disable-next-line @atlaskit/design-system/no-unsafe-design-token-usage
	borderRadius: token('radius.small', '3px'),
	backgroundColor: 'transparent',
	color: token('color.icon'),
	'&:hover': {
		cursor: 'pointer',
		backgroundColor: token('color.background.neutral.subtle.hovered'),
	},
	'&:active': {
		cursor: 'pointer',
		backgroundColor: token('color.background.neutral.subtle.pressed'),
	},
});

const disabledArchiveDownloadButtonWrapperStyles = css({
	paddingTop: `${token('space.100')}`,
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
	paddingRight: '7px',
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
	paddingBottom: '5px',
	paddingLeft: `${token('space.100')}`,

	border: 'none',
	// eslint-disable-next-line @atlaskit/design-system/no-unsafe-design-token-usage
	borderRadius: token('radius.small', '3px'),
	backgroundColor: 'transparent',
	color: token('color.icon'),
	cursor: 'not-allowed',
});

const archiveSidebarFolderWrapperStyles = css({
	transform: 'translateY(-100%)',
	transition: 'all 1s',
	opacity: 0,
	animationName: slideDown,
	animationDuration: '0.3s',
	animationFillMode: 'forwards',
});

const sidebarItemWrapperStyles = css({
	width: '85%',
});

const archiveSidebarFileEntryWrapperStyles = css({
	paddingBottom: token('space.075'),
	display: 'flex',
	alignItems: 'center',
	cursor: 'pointer',
	transition: 'background-color 0.3s',
});

const archiveLayoutStyles = css({
	display: 'flex',
	width: '100%',
	height: '100%',
});

const archiveViewerWrapperStyles = css({
	position: 'absolute',
	top: 0,
	// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	left: `${ARCHIVE_SIDE_BAR_WIDTH}px`,
	right: 0,
	bottom: 0,
	alignItems: 'center',
	display: 'flex',
});

const separatorStyles = css({
	borderRadius: token('radius.full'),
	height: '2px',
	marginTop: `${token('space.200')}`,
	marginRight: '0',
	marginBottom: `${token('space.200')}`,
	marginLeft: '0',
	backgroundColor: token('color.border'),

	flexShrink: 0,
});

const sidebarHeaderWrapperStyles = css({
	display: 'flex',
	alignItems: 'center',
	flexShrink: 0,
});

const sidebarHeaderIconStyles = css({
	display: 'flex',
	alignItems: 'center',
	marginRight: token('space.100'),
	flexShrink: 0,
});

const sidebarHeaderEntryStyles = css({
	flex: '1 1 auto',
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	whiteSpace: 'nowrap',
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
	lineHeight: 1.14286,
	color: token('color.text'),
});

type Children = {
	children?: ReactNode;
};
type OnClick = {
	onClick: (event: MouseEvent<HTMLDivElement>) => void;
};

const fullHeightStyles = css({
	height: '100%',
});

export const ArchiveItemViewerWrapper = ({
	children,
	fullHeight,
}: Children & { fullHeight?: boolean }): JSX.Element => {
	return (
		<div css={[archiveItemViewerWrapperStyles, fullHeight && fullHeightStyles]}>{children}</div>
	);
};

export const ArchiveSideBar: ForwardRefExoticComponent<Children & RefAttributes<HTMLDivElement>> =
	forwardRef(({ children }: Children, ref: React.Ref<HTMLDivElement>) => {
		return (
			<div css={archiveSideBarStyles} ref={ref}>
				{children}
			</div>
		);
	});

export const ArchiveSidebarFolderWrapper = ({ children }: Children): JSX.Element => {
	return (
		<div css={archiveSidebarFolderWrapperStyles} data-testid="archive-sidebar-folder-wrapper">
			{children}
		</div>
	);
};

export const ArchiveDownloadButtonWrapper = ({
	children,
	onClick,
}: Children & OnClick): JSX.Element => {
	const intl = useIntl();
	return fg('platform_media_a11y_suppression_fixes') ? (
		<button
			aria-label={intl.formatMessage(messages.archive_download_label_assistive_text)}
			css={archiveDownloadButtonWrapperStyles}
			onClick={(event) => onClick && onClick(event as unknown as React.MouseEvent<HTMLDivElement>)}
			data-testid="media-archiveDownloadButton"
		>
			{children}
		</button>
	) : (
		// eslint-disable-next-line @atlassian/a11y/click-events-have-key-events, @atlassian/a11y/interactive-element-not-keyboard-focusable, @atlassian/a11y/no-static-element-interactions
		<div
			css={archiveDownloadButtonWrapperStyles}
			onClick={onClick}
			data-testid="media-archiveDownloadButton"
		>
			{children}
		</div>
	);
};

export const DisabledArchiveDownloadButtonWrapper = ({ children }: Children): JSX.Element => {
	return (
		<div
			css={disabledArchiveDownloadButtonWrapperStyles}
			data-testid="media-disabledArchiveDownloadButton"
		>
			{children}
		</div>
	);
};

export const SidebarItemWrapper = ({ children }: Children): JSX.Element => {
	return <div css={sidebarItemWrapperStyles}>{children}</div>;
};

export const ArchiveSidebarFileEntryWrapper = ({
	children,
	index,
}: { index: Key } & Children): JSX.Element => {
	return (
		<div css={archiveSidebarFileEntryWrapperStyles} key={index}>
			{children}
		</div>
	);
};

export const ArchiveLayout = ({ children }: Children): JSX.Element => {
	return (
		<div css={archiveLayoutStyles} data-testid="archive-layout">
			{children}
		</div>
	);
};

export const ArchiveViewerWrapper = ({ children }: Children): JSX.Element => {
	return <div css={archiveViewerWrapperStyles}>{children}</div>;
};

export const Separator = (): JSX.Element => {
	return <div css={separatorStyles} />;
};

export const SidebarHeaderWrapper = ({ children }: Children): JSX.Element => {
	return <span css={sidebarHeaderWrapperStyles}>{children}</span>;
};

export const SidebarHeaderIcon = ({ children }: Children): JSX.Element => {
	return <div css={sidebarHeaderIconStyles}>{children}</div>;
};

export const SidebarHeaderEntry = ({ children }: Children): JSX.Element => {
	return <div css={sidebarHeaderEntryStyles}>{children}</div>;
};
