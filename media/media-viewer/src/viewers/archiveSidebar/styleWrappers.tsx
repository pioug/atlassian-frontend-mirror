/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import {
	type ReactNode,
	forwardRef,
	type ForwardRefExoticComponent,
	type RefAttributes,
} from 'react';

import { jsx, css } from '@compiled/react';

import { token } from '@atlaskit/tokens';

export const ARCHIVE_SIDE_BAR_WIDTH = 300;

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

export type Children = {
	children?: ReactNode;
};

export const ArchiveSideBar: ForwardRefExoticComponent<Children & RefAttributes<HTMLDivElement>> =
	forwardRef(({ children }: Children, ref: React.Ref<HTMLDivElement>) => {
		return (
			<div css={archiveSideBarStyles} ref={ref}>
				{children}
			</div>
		);
	});
