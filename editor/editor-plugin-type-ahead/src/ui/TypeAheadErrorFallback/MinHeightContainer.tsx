/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { forwardRef } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const minHeightComponentStyles = css({
	display: 'flex',
	alignItems: 'stretch',
	justifyContent: 'center',
	minHeight: 'var(--link-picker-min-height)',
});

type MinHeightContainerProps = React.HTMLAttributes<HTMLDivElement> & {
	minHeight: string;
};

export const MinHeightContainer = forwardRef<HTMLDivElement, MinHeightContainerProps>(
	({ minHeight, ...props }: MinHeightContainerProps, ref) => {
		return (
			<div
				ref={ref}
				// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
				css={minHeightComponentStyles}
				// eslint-disable-next-line react/jsx-props-no-spreading
				{...props}
				style={{ ['--link-picker-min-height' as string]: minHeight }}
			/>
		);
	},
);
