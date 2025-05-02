/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ReactNode, type MouseEvent, type Key, forwardRef } from 'react';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx, css, keyframes } from '@compiled/react';
import { token } from '@atlaskit/tokens';
import { DN500 } from '@atlaskit/theme/colors';

export const ARCHIVE_SIDE_BAR_WIDTH = 300;

const archiveItemViewerWrapperStyles = css({
	width: '100%',
	display: 'flex',
	justifyContent: 'center',
});

const archiveSideBarStyles = css({
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
	paddingTop: '22px',
	paddingRight: `${token('space.250', '20px')}`,
	paddingLeft: `${token('space.250', '20px')}`,
	paddingBottom: `${token('space.250', '20px')}`,
	backgroundColor: token('elevation.surface', '#101214'),
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
	paddingTop: `${token('space.100', '8px')}`,
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
	paddingRight: '7px',
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
	paddingBottom: '5px',
	paddingLeft: `${token('space.100', '8px')}`,
	border: 'none',
	borderRadius: '3px',
	backgroundColor: 'transparent',
	color: token('color.icon', '#9FADBC'),
	'&:hover': {
		cursor: 'pointer',
		backgroundColor: token('color.background.neutral.subtle.hovered', '#A1BDD914'),
	},
	'&:active': {
		cursor: 'pointer',
		backgroundColor: token('color.background.neutral.subtle.pressed', '#A6C5E229'),
	},
});

const disabledArchiveDownloadButtonWrapperStyles = css({
	paddingTop: `${token('space.100', '8px')}`,
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
	paddingRight: '7px',
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
	paddingBottom: '5px',
	paddingLeft: `${token('space.100', '8px')}`,

	border: 'none',
	borderRadius: '3px',
	backgroundColor: 'transparent',
	color: token('color.icon', '#9FADBC'),
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
	paddingBottom: token('space.075', '5px'),
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
	borderRadius: '1px',
	height: '2px',
	marginTop: `${token('space.200', '19px')}`,
	marginRight: '0',
	marginBottom: `${token('space.200', '19px')}`,
	marginLeft: '0',
	backgroundColor: token('color.border', '#A6C5E229'),

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
	marginRight: token('space.100', '10px'),
	flexShrink: 0,
});

const sidebarHeaderEntryStyles = css({
	flex: '1 1 auto',
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	whiteSpace: 'nowrap',
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
	lineHeight: 1.14286,
	color: token('color.text', DN500),
});

type Children = {
	children?: ReactNode;
};
type OnClick = {
	onClick: (event: MouseEvent<HTMLDivElement>) => void;
};

export const ArchiveItemViewerWrapper = ({ children }: Children) => {
	return <div css={archiveItemViewerWrapperStyles}>{children}</div>;
};

export const ArchiveSideBar = forwardRef(
	({ children }: Children, ref: React.Ref<HTMLDivElement>) => {
		return (
			<div css={archiveSideBarStyles} ref={ref}>
				{children}
			</div>
		);
	},
);

export const ArchiveSidebarFolderWrapper = ({ children }: Children) => {
	return (
		<div css={archiveSidebarFolderWrapperStyles} data-testid="archive-sidebar-folder-wrapper">
			{children}
		</div>
	);
};

export const ArchiveDownloadButtonWrapper = ({ children, onClick }: Children & OnClick) => {
	return (
		// eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions, @atlassian/a11y/interactive-element-not-keyboard-focusable
		<div
			css={archiveDownloadButtonWrapperStyles}
			onClick={onClick}
			data-testid="media-archiveDownloadButton"
		>
			{children}
		</div>
	);
};

export const DisabledArchiveDownloadButtonWrapper = ({ children }: Children) => {
	return (
		// eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
		<div
			css={disabledArchiveDownloadButtonWrapperStyles}
			data-testid="media-disabledArchiveDownloadButton"
		>
			{children}
		</div>
	);
};

export const SidebarItemWrapper = ({ children }: Children) => {
	return <div css={sidebarItemWrapperStyles}>{children}</div>;
};

export const ArchiveSidebarFileEntryWrapper = ({ children, index }: { index: Key } & Children) => {
	return (
		<div css={archiveSidebarFileEntryWrapperStyles} key={index}>
			{children}
		</div>
	);
};

export const ArchiveLayout = ({ children }: Children) => {
	return (
		<div css={archiveLayoutStyles} data-testid="archive-layout">
			{children}
		</div>
	);
};

export const ArchiveViewerWrapper = ({ children }: Children) => {
	return <div css={archiveViewerWrapperStyles}>{children}</div>;
};

export const Separator = () => {
	return <div css={separatorStyles} />;
};

export const SidebarHeaderWrapper = ({ children }: Children) => {
	return <span css={sidebarHeaderWrapperStyles}>{children}</span>;
};

export const SidebarHeaderIcon = ({ children }: Children) => {
	return <div css={sidebarHeaderIconStyles}>{children}</div>;
};

export const SidebarHeaderEntry = ({ children }: Children) => {
	return <div css={sidebarHeaderEntryStyles}>{children}</div>;
};
