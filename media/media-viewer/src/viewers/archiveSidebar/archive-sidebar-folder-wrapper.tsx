/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { jsx, css, keyframes } from '@compiled/react'; // eslint-disable-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766

import type { Children } from './styleWrappers';

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

const archiveSidebarFolderWrapperStyles = css({
	transform: 'translateY(-100%)',
	transition: 'all 1s',
	opacity: 0,
	animationName: slideDown,
	animationDuration: '0.3s',
	animationFillMode: 'forwards',
});

export const ArchiveSidebarFolderWrapper = ({ children }: Children): JSX.Element => {
	return (
		<div css={archiveSidebarFolderWrapperStyles} data-testid="archive-sidebar-folder-wrapper">
			{children}
		</div>
	);
};
