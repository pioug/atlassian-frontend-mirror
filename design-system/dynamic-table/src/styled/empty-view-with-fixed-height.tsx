/* eslint-disable @repo/internal/react/require-jsdoc */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type FC, type ReactNode } from 'react';

import { css, jsx } from '@compiled/react';

const fixedHeightStyles = css({
	height: '9rem',
});

type EmptyViewWithFixedHeightProps = {
	testId?: string;
	children?: ReactNode;
};

export const EmptyViewWithFixedHeight: FC<EmptyViewWithFixedHeightProps> = ({
	children,
	testId,
}) => (
	<div css={fixedHeightStyles} data-testid={testId && `${testId}--empty-view-with-fixed-height`}>
		{children}
	</div>
);
