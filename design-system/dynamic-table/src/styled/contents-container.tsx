/* eslint-disable @repo/internal/react/require-jsdoc */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type FC, type ReactNode } from 'react';

import { css, jsx } from '@compiled/react';

const CSS_VAR_CONTENTS_OPACITY = '--contents-opacity';

const contentsContainerStyles = css({
	opacity: `var(${CSS_VAR_CONTENTS_OPACITY})`,
	pointerEvents: 'none',
});

interface LoadingContainerProps {
	contentsOpacity: number;
	children: ReactNode;
	testId?: string;
}

export const ContentsContainer: FC<LoadingContainerProps> = ({
	children,
	contentsOpacity,
	testId,
}) => (
	<div
		style={{ [CSS_VAR_CONTENTS_OPACITY]: contentsOpacity } as React.CSSProperties}
		css={contentsContainerStyles}
		data-testid={testId && `${testId}--contents--container`}
	>
		{children}
	</div>
);
