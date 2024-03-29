import styled from '@emotion/styled';

import { N40 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

export const ScrollableContainerHeight = 590;

export const fieldTextFontSize = token(
  'font.body',
  'normal 400 14px/20px ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, system-ui, "Helvetica Neue", sans-serif',
);

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
export const withTablePluginHeaderPrefix = withTablePluginPrefix.bind(
  null,
  'thead',
);
export const withTablePluginBodyPrefix = withTablePluginPrefix.bind(
  null,
  'tbody',
);

export const TableHeading = styled.th({
  [`${withTablePluginHeaderPrefix()}`]: {
    border: 0,
    position: 'relative',
    boxSizing: 'border-box',
    lineHeight: lineHeight,
    padding: `${verticalPadding} ${token('space.050', '4px')}`,
    borderRight: `0.5px solid ${token('color.border', N40)}`,
    borderBottom: `2px solid ${token('color.border', N40)}`,
    height: `calc(${lineHeight} * 2 + ${verticalPadding} * 4 + 2px)`,
    verticalAlign: 'bottom',
    backgroundColor: token('utility.elevation.surface.current', '#FFF'),
  },
  [`${withTablePluginPrefix(
    '',
    'thead.has-column-picker &:nth-last-of-type(2)',
  )}`]: {
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
    padding: `${verticalPadding} ${token('space.050', '4px')}`,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    whiteSpace: 'normal',
    overflow: 'hidden',
    wordWrap: 'break-word',
  },
});
