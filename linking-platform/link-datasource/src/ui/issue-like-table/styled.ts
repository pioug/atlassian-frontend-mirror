// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled from '@emotion/styled';

import { N40 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

export const ScrollableContainerHeight = 590;

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const Table = styled.table({
	width: '100%',
});

const lineHeight = '24px';
const verticalPadding = token('space.025', '2px');

/**
 * This is a hack used to override styles that are leaking to our table html element
 * from editor table plugin.
 * This css prefix can be used in front of our main css rule to make its weight bigger
 * and force make browser use it first and editor plugin css second.
 */
export const withTablePluginPrefix = (
	tableSection: 'thead' | 'tbody' | '',
	mainRule: string = '&',
) => `
  .pm-table-wrapper > table ${tableSection} ${mainRule},
  .ProseMirror .pm-table-wrapper > table ${tableSection} ${mainRule},
  ${mainRule}
`;
export const withTablePluginHeaderPrefix = withTablePluginPrefix.bind(null, 'thead');
export const withTablePluginBodyPrefix = withTablePluginPrefix.bind(null, 'tbody');

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const TableHeading = styled.th({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	[`${withTablePluginHeaderPrefix()}`]: {
		border: 0,
		position: 'relative',
		/* This makes resizing work with out jumping due to padding + changes overall width for same default values. */
		boxSizing: 'border-box',
		lineHeight: lineHeight,
		padding: `${verticalPadding} ${token('space.050', '4px')}`,
		borderRight: `0.5px solid ${token('color.border', N40)}`,
		borderBottom: `2px solid ${token('color.border', N40)}`,
		/*
      lineHeight * 2 -> Max height of two lined header
      verticalPadding * 2 -> padding for this component itself
      verticalPadding * 2 -> padding inside span (--container)
      2px -> Bottom border
      Last two terms are needed because of border-box box sizing.
    */
		height: `calc(${lineHeight} * 2 + ${verticalPadding} * 4 + 2px)`,
		verticalAlign: 'bottom',
		backgroundColor: token('utility.elevation.surface.current', '#FFF'),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	[`${withTablePluginPrefix('', 'thead.has-column-picker &:nth-last-of-type(2)')}`]: {
		borderRight: 0,
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	[`${withTablePluginHeaderPrefix('&:first-child')}`]: {
		paddingLeft: token('space.050', '4px'),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	[`${withTablePluginHeaderPrefix('&:last-child')}`]: {
		borderRight: 0,
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	"& [data-testid='datasource-header-content--container']": {
		width: '100%',
		/* With Button now being a parent for this component it adds its lineHeight value and spoils
      `height` calculation above. */
		lineHeight: lineHeight,
		padding: `${verticalPadding} ${token('space.050', '4px')}`,
		display: '-webkit-box',
		WebkitLineClamp: 2,
		WebkitBoxOrient: 'vertical',
		whiteSpace: 'normal',
		overflow: 'hidden',
		wordWrap: 'break-word',
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const TableCell = styled.td({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	[`${withTablePluginBodyPrefix()}`]: {
		/* First section here is to override things editor table plugin css defines */
		font: token('font.body'),
		padding: `${token('space.050', '4px')} ${token('space.100', '8px')}`,
		border: 0,
		minWidth: 'auto',
		height: '32px',
		verticalAlign: 'inherit',
		boxSizing: 'content-box', // Due to padding, content-box makes td height 40px equal to InlineEdit on height of 32px
		borderRight: `${token('border.width', '1px')} solid ${token('color.border', N40)}`,
		borderBottom: `${token('border.width', '1px')} solid ${token('color.border', N40)}`,
		overflow: 'hidden',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	[`${withTablePluginBodyPrefix('&:first-child')}`]: {
		paddingLeft: token('space.100', '8px'),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	[`${withTablePluginBodyPrefix('&:last-child')}`]: {
		borderRight: 0,
		paddingRight: token('space.100', '8px'),
	},
	// Inline smart links are pretty opinionated about word-wrapping.
	// We want it to be controlled by user, so we make it overflow and truncate by default.
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	["& [data-testid='inline-card-icon-and-title'], " +
	"& [data-testid='button-connect-account'] > span"]: {
		whiteSpace: 'unset',
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- To migrate as part of go/ui-styling-standard
export const InlineEditableTableCell = styled.td({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	[`${withTablePluginBodyPrefix()}`]: {
		/* First section here is to override things editor table plugin css defines */
		font: token('font.body'),
		padding: `${token('space.0', '0')} ${token('space.0', '0')}`,
		border: 0,
		minWidth: 'auto',
		height: '40px',
		verticalAlign: 'inherit',
		boxSizing: 'content-box',
		borderRight: `${token('border.width', '1px')} solid ${token('color.border', N40)}`,
		borderBottom: `${token('border.width', '1px')} solid ${token('color.border', N40)}`,
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	[`${withTablePluginBodyPrefix('&:last-child')}`]: {
		borderRight: 0,
	},
	// Inline smart links are pretty opinionated about word-wrapping.
	// We want it to be controlled by user, so we make it overflow and truncate by default.
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	["& [data-testid='inline-card-icon-and-title'], " +
	"& [data-testid='button-connect-account'] > span"]: {
		whiteSpace: 'unset',
	},
});
