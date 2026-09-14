/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { type ForwardRefExoticComponent, type RefAttributes, forwardRef } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- classic jsx pragma requires emotion's `jsx`; example-only helper, not shipped in the package bundle
import { jsx } from '@emotion/react';

import { dropzoneContainerStyles } from './dropzoneContainerStyles';

export const DropzoneContainer: ForwardRefExoticComponent<
	{
		isActive: boolean;
	} & RefAttributes<unknown>
> = forwardRef(({ isActive }: { isActive: boolean }, ref) => {
	return (
		// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		<div css={dropzoneContainerStyles({ isActive })} ref={ref as React.RefObject<HTMLDivElement>} />
	);
});
