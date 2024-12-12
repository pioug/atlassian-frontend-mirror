// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';
import { token } from '@atlaskit/tokens';
import { responsiveSettings, getTitleBoxHeight, Breakpoint } from '../common';
import { N0, N800 } from '@atlaskit/theme/colors';
import { rgba } from '../styles';
import { type TitleBoxFooterProps, type TitleBoxHeaderProps } from './types';

const generateResponsiveStyles = (breakpoint: Breakpoint = Breakpoint.SMALL) => {
	const setting = responsiveSettings[breakpoint];
	const verticalPadding = setting.titleBox.verticalPadding;
	const horizontalPadding = setting.titleBox.horizontalPadding;
	const height = getTitleBoxHeight(breakpoint);
	return `height: ${height}px;
    padding: ${verticalPadding}px ${horizontalPadding}px;`;
};

const HEX_REGEX = /^#[0-9A-F]{6}$/i;

type TitleBoxWrapperStyleArgs = {
	breakpoint: Breakpoint;
	titleBoxBgColor?: string;
	display?: 'none' | 'flex';
};

export const titleBoxWrapperStyles = ({
	breakpoint,
	display = 'flex',
	titleBoxBgColor,
}: TitleBoxWrapperStyleArgs) =>
	css(
		{
			position: 'absolute',
			bottom: 0,
			width: '100%',
			backgroundColor: token(
				'elevation.surface',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
				rgba(titleBoxBgColor && HEX_REGEX.test(titleBoxBgColor) ? titleBoxBgColor : N0, 1),
			),
			color: token('color.text', N800),
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

const infoStyles = `white-space: nowrap;overflow: hidden;`;

const iconOverlapStyles = `padding-right: 10px;`;

export const titleBoxHeaderStyles = ({ hasIconOverlap }: TitleBoxHeaderProps) =>
	css(
		{
			fontWeight: token('font.weight.semibold'),
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		infoStyles,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		hasIconOverlap && iconOverlapStyles,
	);

titleBoxHeaderStyles.displayName = 'FailedTitleBoxHeader';

export const titleBoxFooterStyles = ({ hasIconOverlap }: TitleBoxFooterProps) =>
	css(
		{
			textOverflow: 'ellipsis',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		infoStyles,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		hasIconOverlap && iconOverlapStyles,
	);

titleBoxFooterStyles.displayName = 'TitleBoxFooter';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const titleBoxIconStyles = css({
	position: 'absolute',
	right: token('space.050', '4px'),
	bottom: '0px',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const newTitleBoxIconStyles = css({
	position: 'absolute',
	right: token('space.050', '4px'),
	bottom: token('space.050', '4px'),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const errorMessageWrapperStyles = css({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'flex-start',
	paddingInlineStart: token('space.025'),
	gap: token('space.025'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	span: {
		verticalAlign: 'middle',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
		':nth-child(2)': {
			marginLeft: token('space.050', '4px'),
			marginRight: token('space.050', '4px'),
		},
	},
});
