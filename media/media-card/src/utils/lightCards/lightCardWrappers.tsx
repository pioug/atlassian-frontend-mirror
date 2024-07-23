/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { wrapperStyles } from './styles';

import { type WrapperProps } from './types';

export const Wrapper = (props: WrapperProps) => {
	return (
		// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		<div css={wrapperStyles({ dimensions: props.dimensions })} {...props}>
			{props.children}
		</div>
	);
};
