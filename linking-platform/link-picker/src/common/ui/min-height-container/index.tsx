/** @jsx jsx */
import React, { forwardRef } from 'react';

import { jsx } from '@emotion/react';

import { minHeightComponentStyles } from './styled';

type MinHeightContainerProps = React.HTMLAttributes<HTMLDivElement> & {
	minHeight: string;
};

export const MinHeightContainer = forwardRef<HTMLDivElement, MinHeightContainerProps>(
	({ minHeight, ...props }: MinHeightContainerProps, ref) => {
		return (
			<div
				ref={ref}
				css={minHeightComponentStyles}
				{...props}
				style={{ ['--link-picker-min-height' as string]: minHeight }}
			/>
		);
	},
);
