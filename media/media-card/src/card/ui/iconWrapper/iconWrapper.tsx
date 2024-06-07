/**@jsx jsx */
import { jsx } from '@emotion/react';

import { iconWrapperStyles } from './styles';
import { type IconWrapperProps } from './types';

export const IconWrapper = (props: IconWrapperProps) => {
	const { breakpoint, hasTitleBox } = props;

	return (
		<div
			id="iconWrapper"
			css={iconWrapperStyles({
				breakpoint,
				hasTitleBox,
			})}
		>
			{props.children}
		</div>
	);
};
