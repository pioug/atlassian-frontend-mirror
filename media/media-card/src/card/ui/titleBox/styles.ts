// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, type SerializedStyles } from '@emotion/react';
import { token } from '@atlaskit/tokens';
import { responsiveSettings, getTitleBoxHeight, Breakpoint } from '../common';
import { type TitleBoxFooterProps, type TitleBoxHeaderProps } from './types';

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
    ({ breakpoint, display, }: TitleBoxWrapperStyleArgs): SerializedStyles;
    displayName: string;
} = ({
	breakpoint,
	display = 'flex',
}: TitleBoxWrapperStyleArgs): SerializedStyles =>
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

const infoStyles = `white-space: nowrap;overflow: hidden;`;

const iconOverlapStyles = `padding-right: 10px;`;

export const titleBoxHeaderStyles: {
	({ hasIconOverlap }: TitleBoxHeaderProps): SerializedStyles;
	displayName: string;
} = ({ hasIconOverlap }: TitleBoxHeaderProps): SerializedStyles =>
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

export const titleBoxFooterStyles: {
	({ hasIconOverlap }: TitleBoxFooterProps): SerializedStyles;
	displayName: string;
} = ({ hasIconOverlap }: TitleBoxFooterProps): SerializedStyles =>
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
export const titleBoxIconStyles: SerializedStyles = css({
	position: 'absolute',
	right: token('space.050'),
	bottom: '0px',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const newTitleBoxIconStyles: SerializedStyles = css({
	position: 'absolute',
	right: token('space.050'),
	bottom: token('space.050'),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const errorMessageWrapperStyles: SerializedStyles = css({
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
			marginLeft: token('space.050'),
			marginRight: token('space.050'),
		},
	},
});
