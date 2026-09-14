/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { type Key } from 'react';

import { jsx, css } from '@compiled/react'; // eslint-disable-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766

import { token } from '@atlaskit/tokens';

import type { Children } from './styleWrappers';

const archiveSidebarFileEntryWrapperStyles = css({
	paddingBottom: token('space.075'),
	display: 'flex',
	alignItems: 'center',
	cursor: 'pointer',
	transition: 'background-color 0.3s',
});

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
