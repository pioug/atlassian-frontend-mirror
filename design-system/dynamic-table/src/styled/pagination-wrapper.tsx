/* eslint-disable @repo/internal/react/require-jsdoc */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type FC, type ReactNode } from 'react';

import { css, jsx } from '@compiled/react';

const paginationWrapperStyles = css({
	display: 'flex',
	justifyContent: 'center',
});

type PaginationWrapperProps = {
	children: ReactNode;
	testId?: string;
};

export const PaginationWrapper: FC<PaginationWrapperProps> = ({ children, testId }) => (
	<div css={paginationWrapperStyles} data-testid={testId && `${testId}--pagination--container`}>
		{children}
	</div>
);
