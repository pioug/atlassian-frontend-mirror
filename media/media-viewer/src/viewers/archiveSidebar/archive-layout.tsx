/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { jsx, css } from '@compiled/react'; // eslint-disable-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766

import type { Children } from './styleWrappers';

const archiveLayoutStyles = css({
	display: 'flex',
	width: '100%',
	height: '100%',
});

export const ArchiveLayout = ({ children }: Children): JSX.Element => {
	return (
		<div css={archiveLayoutStyles} data-testid="archive-layout">
			{children}
		</div>
	);
};
