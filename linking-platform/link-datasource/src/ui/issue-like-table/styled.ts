import styled from '@emotion/styled';

import { N40 } from '@atlaskit/theme/colors';
import { fontFallback } from '@atlaskit/theme/typography';
import { token } from '@atlaskit/tokens';

export const ScrollableContainerHeight = 590;

export const fieldTextFontSize = token('font.body', fontFallback.body.medium);

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
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

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const TableHeading = styled.th({
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
	[`${withTablePluginPrefix('', 'thead.has-column-picker &:nth-last-of-type(2)')}`]: {
		borderRight: 0,
	},
	[`${withTablePluginHeaderPrefix('&:first-child')}`]: {
		paddingLeft: token('space.050', '4px'),
	},
	[`${withTablePluginHeaderPrefix('&:last-child')}`]: {
		borderRight: 0,
	},
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
