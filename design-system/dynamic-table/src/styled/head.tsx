/* eslint-disable @repo/internal/react/require-jsdoc */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type FC, type ReactNode } from 'react';

import { css, jsx } from '@compiled/react';

const rankingStyles = css({ display: 'block' });
const headStyles = css({ borderBlockEnd: `none` });

interface HeadProps {
	isRanking?: boolean;
	children: ReactNode;
	testId?: string;
}

export const Head: FC<HeadProps> = ({ isRanking, testId, ...props }) => {
	return (
		<thead
			css={[headStyles, isRanking && rankingStyles]}
			data-testid={testId}
			// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
			{...props}
		/>
	);
};
