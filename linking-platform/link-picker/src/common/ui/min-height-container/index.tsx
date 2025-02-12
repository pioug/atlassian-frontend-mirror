/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { forwardRef } from 'react';

import { css, jsx } from '@compiled/react';

import { fg } from '@atlaskit/platform-feature-flags';

import { MinHeightContainerOld } from './old';

type MinHeightContainerProps = React.HTMLAttributes<HTMLDivElement> & {
	minHeight: string;
};

const minHeightComponentStyles = css({
	display: 'flex',
	alignItems: 'stretch',
	justifyContent: 'center',
	minHeight: 'var(--link-picker-min-height)',
});

export const MinHeightContainerNew = forwardRef<HTMLDivElement, MinHeightContainerProps>(
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

export const MinHeightContainer = forwardRef<HTMLDivElement, MinHeightContainerProps>(
	(props: MinHeightContainerProps, ref) => {
		if (fg('platform_bandicoots-link-picker-css')) {
			return <MinHeightContainerNew ref={ref} {...props} />;
		}
		return <MinHeightContainerOld ref={ref} {...props} />;
	},
);
