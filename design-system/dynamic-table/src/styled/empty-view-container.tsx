/* eslint-disable @repo/internal/react/require-jsdoc */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type FC, type ReactNode } from 'react';

import { css, jsx } from '@compiled/react';

const emptyViewContainerStyles = css({
	width: '50%',
	margin: 'auto',
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
	padding: '10px',
	textAlign: 'center',
});

interface EmptyViewContainerProps {
	testId?: string;
	children: ReactNode;
}

export const EmptyViewContainer: FC<EmptyViewContainerProps> = (props) => {
	const { children, testId } = props;
	return (
		<div css={emptyViewContainerStyles} data-testid={testId && `${testId}--empty-view-container`}>
			{children}
		</div>
	);
};
