/* eslint-disable @repo/internal/react/require-jsdoc */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type FC, type ReactNode } from 'react';

import { css, jsx } from '@compiled/react';

const spinnerBackdropStyles = css({
	display: 'flex',
	position: 'absolute',
	inset: 0,
	alignItems: 'center',
	justifyContent: 'center',
	pointerEvents: 'none',
});

type SpinnerBackdropProps = {
	testId?: string;
	children: ReactNode;
};

export const SpinnerBackdrop: FC<SpinnerBackdropProps> = ({ children, testId }) => (
	<div css={spinnerBackdropStyles} data-testid={testId && `${testId}--spinner-backdrop`}>
		{children}
	</div>
);
