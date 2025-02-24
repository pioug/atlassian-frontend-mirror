/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx, css } from '@compiled/react';

import { type IconWrapperProps } from './types';
import { type Breakpoint, getTitleBoxHeight } from '../common';

export function titleBoxHeight(hasTitleBox: boolean, breakpoint: Breakpoint) {
	// there is no titlebox
	if (!hasTitleBox) {
		return `0px`;
	}

	// calculate height of the titlebox
	const marginBottom = getTitleBoxHeight(breakpoint);

	return `${marginBottom}px`;
}

const iconWrapperStyles = css({
	position: 'absolute',
	width: '100%',
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
	alignItems: 'center',
});

export const IconWrapper = (props: IconWrapperProps) => {
	const { breakpoint, hasTitleBox } = props;

	return (
		<div
			id="iconWrapper"
			style={{
				height: `calc(100% - ${titleBoxHeight(hasTitleBox, breakpoint)})`,
			}}
			css={iconWrapperStyles}
		>
			{props.children}
		</div>
	);
};

IconWrapper.displayName = 'MediaIconWrapper';
