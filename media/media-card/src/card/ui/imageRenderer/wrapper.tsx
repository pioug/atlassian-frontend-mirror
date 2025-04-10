/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx, css } from '@compiled/react';
import { type ReactNode } from 'react';

const wrapperStyles = css({
	position: 'absolute',
	width: '100%',
	height: '100%',
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
	alignItems: 'center',
});

export const ImageRendererWrapper = ({ children }: { children: ReactNode }) => (
	<div data-testid="ImageRendererWrapper" css={wrapperStyles}>
		{children}
	</div>
);
