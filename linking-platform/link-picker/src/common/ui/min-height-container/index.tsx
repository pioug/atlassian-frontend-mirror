/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { forwardRef } from 'react';

import { css, jsx } from '@compiled/react';

type MinHeightContainerProps = React.HTMLAttributes<HTMLDivElement> & {
	minHeight: string;
};

const minHeightComponentStyles = css({
	display: 'flex',
	alignItems: 'stretch',
	justifyContent: 'center',
	minHeight: 'var(--link-picker-min-height)',
});

export const MinHeightContainer = forwardRef<HTMLDivElement, MinHeightContainerProps>(
	({ className, minHeight, ...props }: MinHeightContainerProps, ref) => {
		return (
			<div
				ref={ref}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
				className={className}
				css={minHeightComponentStyles}
				{...props}
				style={{ ['--link-picker-min-height' as string]: minHeight }}
			/>
		);
	},
);
