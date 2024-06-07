import { css } from '@emotion/react';
import { type Breakpoint, getTitleBoxHeight } from '../common';
import { type IconWrapperProps } from './types';

export function titleBoxHeight(hasTitleBox: boolean, breakpoint: Breakpoint) {
	// there is no titlebox
	if (!hasTitleBox) {
		return `0px`;
	}

	// calculate height of the titlebox
	const marginBottom = getTitleBoxHeight(breakpoint);

	return `${marginBottom}px`;
}

export const iconWrapperStyles = ({ hasTitleBox, breakpoint }: IconWrapperProps) =>
	css({
		position: 'absolute',
		width: '100%',
		height: `calc(100% - ${titleBoxHeight(hasTitleBox, breakpoint)})`,
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
	});

iconWrapperStyles.displayName = 'MediaIconWrapper';
