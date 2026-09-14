import { css, type SerializedStyles } from '@emotion/react'; // eslint-disable-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766

import { type Breakpoint, getTitleBoxHeight } from '../common';

function titleBoxHeight(hasTitleBox: boolean, breakpoint: Breakpoint): string {
	if (!hasTitleBox) {
		return '0px';
	}
	return `${getTitleBoxHeight(breakpoint)}px`;
}
import { type IconWrapperProps } from './types';

export const iconWrapperStyles: {
	({ hasTitleBox, breakpoint }: IconWrapperProps): SerializedStyles;
	displayName: string;
} = ({ hasTitleBox, breakpoint }: IconWrapperProps): SerializedStyles =>
	css({
		position: 'absolute',
		width: '100%',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		height: `calc(100% - ${titleBoxHeight(hasTitleBox, breakpoint)})`,
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
	});

iconWrapperStyles.displayName = 'MediaIconWrapper';
