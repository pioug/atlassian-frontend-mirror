/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { type Key } from 'react';

import { jsx, css } from '@compiled/react'; // eslint-disable-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766

import { token } from '@atlaskit/tokens';

import { useIsInsetViewer } from '../../insetViewerContext';
import type { Children } from './styleWrappers';

const archiveSidebarFileEntryWrapperStyles = css({
	paddingBottom: token('space.075'),
	display: 'flex',
	alignItems: 'center',
	cursor: 'pointer',
	transition: 'background-color 0.3s',
});

// A full-width 40px row: the hover, pressed and selected states cover the name and the download
// button.
const insetViewerRowStyles = css({
	height: token('space.500'),
	paddingBottom: token('space.0'),
	paddingLeft: token('space.200'),
	paddingRight: token('space.200'),
	boxSizing: 'border-box',
	'&:hover': {
		backgroundColor: token('color.background.neutral.subtle.hovered'),
	},
	'&:active': {
		backgroundColor: token('color.background.neutral.subtle.pressed'),
	},
});

const insetViewerSelectedRowStyles = css({
	backgroundColor: token('color.background.selected'),
	boxShadow: `inset ${token('border.width.selected')} 0 0 ${token('color.border.selected')}`,
	'&:hover': {
		backgroundColor: token('color.background.selected.hovered'),
	},
	'&:active': {
		backgroundColor: token('color.background.selected.pressed'),
	},
});

export const ArchiveSidebarFileEntryWrapper = ({
	children,
	index,
	isSelected,
}: { index: Key; isSelected?: boolean } & Children): JSX.Element => {
	const isInsetViewer = useIsInsetViewer();
	return (
		<div
			css={[
				archiveSidebarFileEntryWrapperStyles,
				isInsetViewer && insetViewerRowStyles,
				isInsetViewer && isSelected && insetViewerSelectedRowStyles,
			]}
			key={index}
		>
			{children}
		</div>
	);
};
