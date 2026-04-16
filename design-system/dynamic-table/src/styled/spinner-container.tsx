/* eslint-disable @repo/internal/react/require-jsdoc */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type FC, type ReactNode } from 'react';

import { css, jsx } from '@compiled/react';

const spinnerContainerStyles = css({
	display: 'flex',
	position: 'absolute',
	inset: 0,
	alignItems: 'center',
	justifyContent: 'center',
});

type SpinnerContainerProps = {
	testId?: string;
	children: ReactNode;
};

export const SpinnerContainer: FC<SpinnerContainerProps> = ({ children, testId }) => (
	<div css={spinnerContainerStyles} data-testid={testId && `${testId}--spinner--container`}>
		{children}
	</div>
);
