/* eslint-disable @repo/internal/react/require-jsdoc */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type FC, type ReactNode } from 'react';

import { css, jsx } from '@compiled/react';

const containerStyles = css({
	position: 'relative',
});

type ContainerProps = {
	testId?: string;
	children: ReactNode;
};

export const Container: FC<ContainerProps> = ({ children, testId }) => (
	<div css={containerStyles} data-testid={testId && `${testId}--container`}>
		{children}
	</div>
);
