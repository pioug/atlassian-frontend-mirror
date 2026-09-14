import { css, type SerializedStyles } from '@emotion/react'; // eslint-disable-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766

import { token } from '@atlaskit/tokens';

import { responsiveSettings, getTitleBoxHeight, Breakpoint } from '../common';

const generateResponsiveStyles = (breakpoint: Breakpoint = Breakpoint.SMALL) => {
	const setting = responsiveSettings[breakpoint];
	const verticalPadding = setting.titleBox.verticalPadding;
	const horizontalPadding = setting.titleBox.horizontalPadding;
	const height = getTitleBoxHeight(breakpoint);
	return `height: ${height}px;
    padding: ${verticalPadding}px ${horizontalPadding}px;`;
};

type TitleBoxWrapperStyleArgs = {
	breakpoint: Breakpoint;
	titleBoxBgColor?: string;
	display?: 'none' | 'flex';
};

export const titleBoxWrapperStyles: {
	({ breakpoint, display }: TitleBoxWrapperStyleArgs): SerializedStyles;
	displayName: string;
} = ({ breakpoint, display = 'flex' }: TitleBoxWrapperStyleArgs): SerializedStyles =>
	css(
		{
			position: 'absolute',
			bottom: 0,
			width: '100%',
			backgroundColor: token('elevation.surface'),
			color: token('color.text'),
			cursor: 'inherit',
			pointerEvents: 'none',
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			display,
			flexDirection: 'column',
			justifyContent: 'center',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		generateResponsiveStyles(breakpoint),
	);

titleBoxWrapperStyles.displayName = 'TitleBoxWrapper';
