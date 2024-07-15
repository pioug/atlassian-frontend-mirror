// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, type CSSObject, type SerializedStyles } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import { tabColors, tabLineColors } from './colors';

const tabInlinePadding = token('space.100', '8px');
const tabBlockPadding = token('space.075', '6px');
const tabInlineMargin = token('space.negative.100', '-8px');
// TODO this should probably be `border.width.indicator`
const underlineHeight = token('border.width.outline', '2px');

const getTabPanelStyles = (): CSSObject => ({
	flexGrow: 1,
	/*
    NOTE min-height set to 0% because of Firefox bug
    FF http://stackoverflow.com/questions/28636832/firefox-overflow-y-not-working-with-nested-flexbox
  */
	minHeight: '0%',
	display: 'flex',
});

export const getTabsStyles = (): SerializedStyles =>
	// eslint-disable-next-line @repo/internal/styles/no-exported-styles
	css({
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		'& [role="tabpanel"]': getTabPanelStyles(),
		// The hidden attribute doesn't work on flex elements
		// Change display to be none
		// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'& > [hidden]': {
			display: 'none',
		},
	});

const tabLineStyles: CSSObject = {
	content: '""',
	bottom: 0,
	margin: 0,
	position: 'absolute',
	width: 'inherit',
	insetInlineStart: tabInlinePadding,
	insetInlineEnd: 0,
};

export const getTabListStyles = (): SerializedStyles =>
	// eslint-disable-next-line @repo/internal/styles/no-exported-styles
	css({
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		'& [role="tab"]': getTabStyles(),
		fontWeight: token('font.weight.medium', '500'),
		marginInlineStart: tabInlineMargin,
		'&::before': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			...tabLineStyles,
			height: token('border.width'),
			// This line is not a border so the selected line is visible in high contrast mode
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			backgroundColor: tabLineColors.lineColor,
		},
	});

export const getTabStyles = (): CSSObject => {
	const colors = tabColors;
	return {
		color: colors.labelColor,
		cursor: 'pointer',
		margin: 0,
		padding: `${tabBlockPadding} ${tabInlinePadding}`,
		position: 'relative',
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		textOverflow: 'ellipsis',

		'&:hover': {
			// TODO: interaction states will be reviewed in DSP-1438
			color: colors.hoverLabelColor,
			'&::after': {
				...tabLineStyles,
				insetInlineEnd: tabInlinePadding,
				borderBottom: `${token('border.width.indicator')} solid ${tabLineColors.hoveredColor}`,
				height: 0,
			},
		},

		'&:active': {
			// TODO: interaction states will be reviewed in DSP-1438
			color: colors.activeLabelColor,
			'&::after': {
				...tabLineStyles,
				insetInlineEnd: tabInlinePadding,
				borderBottom: `${token('border.width.indicator')} solid ${tabLineColors.activeColor}`,
				height: 0,
			},
		},

		'&[aria-selected="true"]': {
			color: colors.selectedColor,
			'&::after': {
				...tabLineStyles,
				insetInlineEnd: tabInlinePadding,
				// This line is a border so it is visible in high contrast mode
				borderBottom: `${token('border.width.indicator')} solid ${tabLineColors.selectedColor}`,
				height: 0,
			},
		},
	};
};

const tabLineStylesOld: CSSObject = {
	content: '""',
	borderRadius: token('border.radius.050', '2px'),
	bottom: 0,
	margin: 0,
	position: 'absolute',
	width: 'inherit',
	insetInlineStart: tabInlinePadding,
	insetInlineEnd: 0,
};

export const getTabListStylesOld = (): SerializedStyles =>
	// eslint-disable-next-line @repo/internal/styles/no-exported-styles
	css({
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		'& [role="tab"]': getTabStylesOld(),
		fontWeight: token('font.weight.medium', '500'),
		marginInlineStart: tabInlineMargin,
		'&::before': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			...tabLineStylesOld,
			height: underlineHeight,
			// This line is not a border so the selected line is visible in high contrast mode
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			backgroundColor: tabLineColors.lineColor,
		},
	});

export const getTabStylesOld = (): CSSObject => {
	const colors = tabColors;
	return {
		color: colors.labelColor,
		cursor: 'pointer',
		margin: 0,
		padding: `${tabBlockPadding} ${tabInlinePadding}`,
		position: 'relative',
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		textOverflow: 'ellipsis',

		'&:hover': {
			// TODO: interaction states will be reviewed in DSP-1438
			color: colors.hoverLabelColor,
			'&::after': {
				...tabLineStylesOld,
				insetInlineEnd: tabInlinePadding,
				borderBottom: `${underlineHeight} solid ${tabLineColors.hoveredColor}`,
				height: 0,
			},
		},

		'&:active': {
			// TODO: interaction states will be reviewed in DSP-1438
			color: colors.activeLabelColor,
			'&::after': {
				...tabLineStylesOld,
				insetInlineEnd: tabInlinePadding,
				borderBottom: `${underlineHeight} solid ${tabLineColors.activeColor}`,
				height: 0,
			},
		},

		'&[aria-selected="true"]': {
			color: colors.selectedColor,
			'&::after': {
				...tabLineStylesOld,
				insetInlineEnd: tabInlinePadding,
				// This line is a border so it is visible in high contrast mode
				borderBottom: `${underlineHeight} solid ${tabLineColors.selectedColor}`,
				height: 0,
			},
		},
	};
};
