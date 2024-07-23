/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import { iconWrapperStyles } from './styles';
import { type IconWrapperProps } from './types';

export const IconWrapper = (props: IconWrapperProps) => {
	const { breakpoint, hasTitleBox } = props;

	return (
		<div
			id="iconWrapper"
			// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			css={iconWrapperStyles({
				breakpoint,
				hasTitleBox,
			})}
		>
			{props.children}
		</div>
	);
};
